const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const User = require("../models/User");

router.get("/employee", auth, role("EMPLOYEE"), (req,res)=>{
  res.json({msg:"Employee Dashboard"});
});

router.get("/admin", auth, role("ADMIN"), async(req,res)=>{
  const users = await User.find();
  res.json(users);
});

module.exports = router;
