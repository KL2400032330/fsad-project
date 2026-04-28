const mongoose = require("mongoose");

const HoursSchema = new mongoose.Schema({
  student: { type: String, required: true },
  hours: { type: Number, required: true },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hours", HoursSchema);
