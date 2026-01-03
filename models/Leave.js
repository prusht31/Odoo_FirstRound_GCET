const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  type: String,
  fromDate: String,
  toDate: String,
  reason: String,
  status: { type:String, default:"Pending" },
  adminComment: String
});

module.exports = mongoose.model("Leave", LeaveSchema);
