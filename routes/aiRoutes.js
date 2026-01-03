const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");
const role = require("../middleware/role"); 
const aiCtrl = require("../controllers/aiController");
const predict = require("../ai/leaveAI");

router.get("/leave-predict/:userId", auth, async(req,res)=>{
  const leaves = await Leave.countDocuments({userId:req.params.userId});
  const att = await Attendance.countDocuments({userId:req.params.userId});
  const percent = predict(leaves, att, 30);
  res.json({approvalChance: percent});
});
router.get("/fraud", auth, role("ADMIN"), aiCtrl.detectFraud);

module.exports = router;
