const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  student: { type: String, required: true },
  job: { type: String, required: true },
  jobId: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", ApplicationSchema);
