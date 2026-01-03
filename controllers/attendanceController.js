const Attendance = require("../models/Attendance");

exports.checkIn = async(req,res)=>{
  const today = new Date().toLocaleDateString();
  const record = await Attendance.create({
    userId:req.user.id,
    date:today,
    checkIn:new Date().toLocaleTimeString()
  });

  req.io.emit("new-attendance", record);
  res.json(record);
};

exports.checkOut = async(req,res)=>{
  const today = new Date().toLocaleDateString();
  const record = await Attendance.findOne({userId:req.user.id, date:today});
  record.checkOut = new Date().toLocaleTimeString();
  await record.save();
  res.json(record);
};

exports.getAll = async(req,res)=>{
  const data = await Attendance.find().populate("userId","name employeeId");
  res.json(data);
};
