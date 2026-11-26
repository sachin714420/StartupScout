
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/saved-jobs", require("./savedJobs"));

// Cache jobs to avoid repeatedly calling the external API
let cachedJobs = [];
let lastFetched = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Fetch real jobs from Arbeitnow
async function fetchJobs() {
  const now = Date.now();

  if (cachedJobs.length && now - lastFetched < CACHE_DURATION) {
    return cachedJobs;
  }

  const response = await fetch(
    "https://www.arbeitnow.com/api/job-board-api?page=1",
    { signal: AbortSignal.timeout(15000) }
  );

  if (!response.ok) {
    throw new Error(`Arbeitnow API error: ${response.status}`);
  }

  const result = await response.json();

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid API response");
  }

  const jobs = result.data
    .filter(job => job.title && job.company_name && job.url)
    .map(job => {
      const jobText = [
        job.title,
        ...(job.tags || []),
        ...(job.job_types || [])
      ].join(" ").toLowerCase();

      const isInternship = /\bintern(ship)?\b|\bpraktikant\b/.test(jobText);

      return {
        id: `arbeitnow-${job.slug}`,
        title: job.title,
        company: job.company_name,
        type: isInternship ? "Internship" : "Job",
        location: job.remote ? "Remote" : (job.location || "Not specified"),
        skills: job.tags || [],
        source: "Arbeitnow",
        url: job.url,
        postedAt: job.created_at
          ? new Date(job.created_at * 1000).toISOString()
          : null
      };
    });

  // Remove duplicate listings
  const uniqueJobs = [
    ...new Map(jobs.map(job => [job.url, job])).values()
  ];

  cachedJobs = uniqueJobs;
  lastFetched = now;

  return cachedJobs;
}


const db = require("./db");

async function syncJobsToDatabase(jobs) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const job of jobs) {
      const [company] = await connection.execute(
        `INSERT INTO companies (company_name)
         VALUES (?)
         ON DUPLICATE KEY UPDATE company_id = LAST_INSERT_ID(company_id)`,
        [job.company]
      );

      const companyId = company.insertId;

      const [result] = await connection.execute(
        `INSERT INTO opportunities
         (company_id, title, opportunity_type, location, source, apply_url, external_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         company_id = VALUES(company_id),
         opportunity_id = LAST_INSERT_ID(opportunity_id)`,
        [
          companyId,
          job.title,
          job.type,
          job.location,
          job.source,
          job.url,
          job.id
        ]
      );

      const opportunityId = result.insertId;

      for (const skill of [...new Set(job.skills || [])]) {
        if (!skill || skill.length > 100) continue;

        const [skillResult] = await connection.execute(
          `INSERT INTO skills (skill_name)
           VALUES (?)
           ON DUPLICATE KEY UPDATE skill_id = LAST_INSERT_ID(skill_id)`,
          [skill]
        );

        await connection.execute(
          `INSERT IGNORE INTO opportunity_skills
           (opportunity_id, skill_id) VALUES (?, ?)`,
          [opportunityId, skillResult.insertId]
        );
      }
    }

    await connection.commit();
    return jobs.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Sync live opportunities into MySQL
let lastDatabaseSync = 0;

async function syncJobsToDatabase(jobs) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const job of jobs) {
      // 1. Insert or find company
      const [companyResult] = await connection.execute(
        `INSERT INTO companies (company_name)
         VALUES (?)
         ON DUPLICATE KEY UPDATE
         company_id = LAST_INSERT_ID(company_id)`,
        [job.company]
      );

      const companyId = companyResult.insertId;

      // 2. Insert or update opportunity
      const [opportunityResult] = await connection.execute(
        `INSERT INTO opportunities
         (company_id, title, opportunity_type, location, source, apply_url, external_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         opportunity_id = LAST_INSERT_ID(opportunity_id),
         company_id = VALUES(company_id),
         title = VALUES(title),
         opportunity_type = VALUES(opportunity_type),
         location = VALUES(location),
         source = VALUES(source),
         apply_url = VALUES(apply_url)`,
        [
          companyId,
          job.title,
          job.type,
          job.location,
          job.source,
          job.url,
          job.id
        ]
      );

      const opportunityId = opportunityResult.insertId;

      // 3. Update opportunity skills
      await connection.execute(
        "DELETE FROM opportunity_skills WHERE opportunity_id = ?",
        [opportunityId]
      );

      for (const skill of (job.skills || [])) {
        const skillName = String(skill).trim();
        if (!skillName) continue;

        const [skillResult] = await connection.execute(
          `INSERT INTO skills (skill_name)
           VALUES (?)
           ON DUPLICATE KEY UPDATE
           skill_id = LAST_INSERT_ID(skill_id)`,
          [skillName]
        );

        await connection.execute(
          `INSERT IGNORE INTO opportunity_skills
           (opportunity_id, skill_id)
           VALUES (?, ?)`,
          [opportunityId, skillResult.insertId]
        );
      }
    }

    await connection.commit();
    console.log(`Database synced: ${jobs.length} opportunities`);

  } catch (error) {
    await connection.rollback();
    console.error("Database sync error:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Health API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StartupScout backend is running!"
  });
});

// Get real opportunities with search and filters
app.get("/api/opportunities", async (req, res) => {
  try {
    const { search, type, location } = req.query;

    // Fetch live jobs from Arbeitnow
    let result = await fetchJobs();

    // Database sync is optional
    let idMap = new Map();

    if (Date.now() - lastDatabaseSync > CACHE_DURATION) {
      lastDatabaseSync = Date.now();

      try {
        await syncJobsToDatabase(result);
        console.log("Opportunities synced with database.");
      } catch (dbError) {
        console.error("Database sync skipped:", dbError);
      }
    }

    // Fetch database IDs only when database is available
    try {
      const [dbRows] = await db.execute(
        "SELECT opportunity_id, external_id FROM opportunities WHERE external_id IS NOT NULL"
      );

      idMap = new Map(
        dbRows.map(row => [row.external_id, row.opportunity_id])
      );
    } catch (dbError) {
      console.log("Database ID lookup skipped:", dbError.message);
    }

    // Add database IDs where available
    result = result.map(job => ({
      ...job,
      dbId: idMap.get(job.id) ?? null
    }));

    // Search filter
    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter(job =>
        `${job.title} ${job.company} ${(job.skills || []).join(" ")}`
          .toLowerCase()
          .includes(keyword)
      );
    }

    // Type filter
    if (type && type !== "All") {
      result = result.filter(job => job.type === type);
    }

    // Location filter
    if (location) {
      result = result.filter(job =>
        (job.location || "").toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json({
      success: true,
      total: result.length,
      data: result
    });

  } catch (error) {
    console.error("Opportunity fetch error:", error);

    res.status(502).json({
      success: false,
      message: "Unable to fetch opportunities. Please try again later."
    });
  }
});


// Start server

db.getConnection()
  .then(connection => {
    console.log("MySQL Connected Successfully!");
    connection.release();
  })
  .catch(err => console.log("Database Error:", err.message));
app.listen(PORT, () => {
  console.log(`StartupScout API running at http://localhost:${PORT}`);
});
