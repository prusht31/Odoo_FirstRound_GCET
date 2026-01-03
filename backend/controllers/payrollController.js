const Payroll = require("../models/Payroll");

exports.addPayroll = async(req,res)=>{
  const {userId,basic,hra,bonus,deductions,month} = req.body;
  const netSalary = basic + hra + bonus - deductions;
  const pay = await Payroll.create({userId,basic,hra,bonus,deductions,netSalary,month});
  res.json(pay);
};

exports.myPayroll = async(req,res)=>{
  const data = await Payroll.find({userId:req.user.id});
  res.json(data);
};

exports.allPayroll = async(req,res)=>{
  const data = await Payroll.find().populate("userId","name");
  res.json(data);
};

const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.generateSlip = async(req,res)=>{
  const pay = await Payroll.findById(req.params.id).populate("userId","name");
  const doc = new PDFDocument();
  const file = `slip_${pay._id}.pdf`;

  doc.pipe(fs.createWriteStream(file));
  doc.text(`Employee: ${pay.userId.name}`);
  doc.text(`Month: ${pay.month}`);
  doc.text(`Net Salary: ₹${pay.netSalary}`);
  doc.end();

  res.json({file});
};
