const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
