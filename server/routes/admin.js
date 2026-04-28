const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Student = require("../models/Student");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Hours = require("../models/Hours");
const Feedback = require("../models/Feedback");

// --- STUDENTS ---
router.get("/students", auth, async (req, res) => {
  const students = await Student.find({}, "-password");
  res.json(students);
});

router.post("/students", auth, async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    const student = new Student({ username, password, name, email });
    await student.save();
    res.json({ message: "Student added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/students/:username", auth, async (req, res) => {
  await Student.deleteOne({ username: req.params.username });
  res.json({ message: "Student removed" });
});

// --- JOBS ---
router.get("/jobs", auth, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.post("/jobs", auth, async (req, res) => {
  const { title, description } = req.body;
  const job = new Job({ title, description });
  await job.save();
  res.json(job);
});

router.delete("/jobs/:id", auth, async (req, res) => {
  await Job.deleteOne({ _id: req.params.id });
  res.json({ message: "Job removed" });
});

// --- APPLICATIONS ---
router.get("/applications", auth, async (req, res) => {
  const apps = await Application.find().sort({ appliedAt: -1 });
  res.json(apps);
});

router.put("/applications/:id", auth, async (req, res) => {
  const { status } = req.body;
  await Application.findByIdAndUpdate(req.params.id, { status });
  res.json({ message: "Status updated" });
});

// --- HOURS ---
router.get("/hours", auth, async (req, res) => {
  const hours = await Hours.find().sort({ date: -1 });
  res.json(hours);
});

// --- FEEDBACK ---
router.get("/feedback", auth, async (req, res) => {
  const fb = await Feedback.find().sort({ createdAt: -1 });
  res.json(fb);
});

router.post("/feedback", auth, async (req, res) => {
  const { student, message } = req.body;
  const fb = new Feedback({ student, message });
  await fb.save();
  res.json(fb);
});

router.delete("/feedback/:id", auth, async (req, res) => {
  await Feedback.deleteOne({ _id: req.params.id });
  res.json({ message: "Feedback deleted" });
});

// --- OVERVIEW ---
router.get("/overview", auth, async (req, res) => {
  try {
    const [students, jobs, applications, hours] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Hours.find()
    ]);
    const totalHours = hours.reduce((sum, h) => sum + h.hours, 0);
    const pending = await Application.countDocuments({ status: "Pending" });
    res.json({ students, jobs, applications, totalHours, pending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
