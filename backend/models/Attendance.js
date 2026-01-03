const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  date: String,
  checkIn: String,
  checkOut: String,
  status: { type:String, default:"Present" }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
