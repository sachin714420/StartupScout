
const express = require("express");
const router = express.Router();
const db = require("./db");
const jwt = require("jsonwebtoken");

// Verify logged-in user
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

// GET: Logged-in user's saved jobs
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [jobs] = await db.execute(
      `SELECT
        o.opportunity_id,
        o.title,
        o.opportunity_type AS type,
        o.location,
        o.source,
        o.apply_url AS url,
        c.company_name AS company,
        s.saved_at
       FROM saved_jobs s
       JOIN opportunities o
         ON s.opportunity_id = o.opportunity_id
       LEFT JOIN companies c
         ON o.company_id = c.company_id
       WHERE s.user_id = ?
       ORDER BY s.saved_at DESC`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      total: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error("Get saved jobs error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch saved jobs"
    });
  }
});

// POST: Save a job
router.post("/:id", authenticateToken, async (req, res) => {
  try {
    const opportunityId = Number(req.params.id);
    console.log("SAVE REQUEST:", req.user, opportunityId);

    if (!Number.isSafeInteger(opportunityId) || opportunityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID"
      });
    }

    await db.execute(
      `INSERT IGNORE INTO saved_jobs (user_id, opportunity_id)
       VALUES (?, ?)`,
      [req.user.user_id, opportunityId]
    );

    res.status(201).json({
      success: true,
      message: "Job saved successfully"
    });
  } catch (error) {
    console.error("Save job error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to save job"
    });
  }
});

// DELETE: Remove a saved job
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const opportunityId = Number(req.params.id);

    if (!Number.isSafeInteger(opportunityId) || opportunityId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid opportunity ID"
      });
    }

    const [result] = await db.execute(
      `DELETE FROM saved_jobs
       WHERE user_id = ? AND opportunity_id = ?`,
      [req.user.user_id, opportunityId]
    );

    res.json({
      success: true,
      message: result.affectedRows
        ? "Job removed successfully"
        : "Job was not saved"
    });
  } catch (error) {
    console.error("Remove saved job error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to remove saved job"
    });
  }
});

module.exports = router;
