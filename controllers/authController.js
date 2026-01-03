const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req,res)=>{
  const {name, employeeId, email, password, role} = req.body;
  const hash = await bcrypt.hash(password,10);
  const user = await User.create({name, employeeId, email, password:hash, role});
  res.json({message:"Registered Successfully"});
};

exports.login = async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user || !(await bcrypt.compare(password,user.password)))
    return res.status(401).json({msg:"Invalid Credentials"});

  const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);
  res.json({token, role:user.role});
};
