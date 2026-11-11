
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

    let result = await fetchJobs();

    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter(job =>
        `${job.title} ${job.company} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (type && type !== "All") {
      result = result.filter(job => job.type === type);
    }

    if (location) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json({
      success: true,
      total: result.length,
      data: result
    });

  } catch (error) {
    console.error("Opportunity fetch error:", error.message);

    res.status(502).json({
      success: false,
      message: "Unable to fetch opportunities. Please try again later."
    });
  }
});

// Start server
const db = require("./db");

db.getConnection()
  .then(connection => {
    console.log("MySQL Connected Successfully!");
    connection.release();
  })
  .catch(err => console.log("Database Error:", err.message));
app.listen(PORT, () => {
  console.log(`StartupScout API running at http://localhost:${PORT}`);
});
