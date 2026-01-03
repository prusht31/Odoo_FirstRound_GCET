const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  basic: Number,
  hra: Number,
  bonus: Number,
  deductions: Number,
  netSalary: Number,
  month: String
});

module.exports = mongoose.model("Payroll", PayrollSchema);
