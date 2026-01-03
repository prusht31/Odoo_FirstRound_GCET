const Leave = require("../models/Leave");

exports.applyLeave = async(req,res)=>{
  const leave = await Leave.create({...req.body, userId:req.user.id});
  req.io.emit("new-leave", leave);
  res.json(leave);
};

exports.getMyLeaves = async(req,res)=>{
  const data = await Leave.find({userId:req.user.id});
  res.json(data);
};

exports.getAllLeaves = async(req,res)=>{
  const data = await Leave.find().populate("userId","name");
  res.json(data);
};

exports.approveReject = async(req,res)=>{
  const {status, adminComment} = req.body;
  const leave = await Leave.findByIdAndUpdate(req.params.id,{status, adminComment},{new:true});
  res.json(leave);
};
