const Attendance = require("../models/Attendance");
const fraudAI = require("../ai/fraudAI");

exports.detectFraud = async(req,res)=>{
  const data = await Attendance.find();
  const suspicious = fraudAI(data);
  res.json(suspicious);
};
