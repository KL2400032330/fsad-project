const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Hours = require("../models/Hours");
const Feedback = require("../models/Feedback");

// --- JOBS ---
router.get("/jobs", auth, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// --- APPLICATIONS ---
router.get("/applications", auth, async (req, res) => {
  const apps = await Application.find({ student: req.user.username }).sort({ appliedAt: -1 });
  res.json(apps);
});

router.post("/applications", auth, async (req, res) => {
  const { jobId, job, reason } = req.body;
  const existing = await Application.findOne({ student: req.user.username, jobId });
  if (existing) return res.status(400).json({ message: "Already applied for this job" });
  const app = new Application({ student: req.user.username, job, jobId, reason });
  await app.save();
  res.json(app);
});

// --- HOURS ---
router.get("/hours", auth, async (req, res) => {
  const hours = await Hours.find({ student: req.user.username }).sort({ date: -1 });
  res.json(hours);
});

router.post("/hours", auth, async (req, res) => {
  const { hours, description } = req.body;
  const entry = new Hours({ student: req.user.username, hours, description });
  await entry.save();
  res.json(entry);
});

// --- FEEDBACK ---
router.get("/feedback", auth, async (req, res) => {
  const fb = await Feedback.find({ student: req.user.username }).sort({ createdAt: -1 });
  res.json(fb);
});

module.exports = router;
