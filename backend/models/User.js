const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  employeeId: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["ADMIN", "EMPLOYEE"], default: "EMPLOYEE" },
  department: String,
  phone: String,
  address: String,
  salary: Number,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
