const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  // Admin hardcoded credentials
  if (role === "admin") {
    if (username === "admin" && password === "admin123") {
      const token = jwt.sign({ username: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
      return res.json({ token, role: "admin", username: "admin" });
    }
    return res.status(400).json({ message: "Invalid admin credentials" });
  }

  // Student login
  try {
    const student = await Student.findOne({ username });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ username: student.username, role: "student" }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, role: "student", username: student.username });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
