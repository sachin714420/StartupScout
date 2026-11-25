
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// JWT authentication middleware
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

// Generate JWT
function generateToken(user) {
  return jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const [existing] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [normalizedName, normalizedEmail, passwordHash]
    );

    const user = {
      user_id: result.insertId,
      name: normalizedName,
      email: normalizedEmail
    };

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user),
      user
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await db.execute(
      "SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(safeUser),
      user: safeUser
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// GET LOGGED-IN USER
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?",
      [req.user.user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error("Profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch profile"
    });
  }
});

module.exports = router;
