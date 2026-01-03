const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/leaveController");

router.post("/apply", auth, ctrl.applyLeave);
router.get("/my", auth, ctrl.getMyLeaves);
router.get("/all", auth, role("ADMIN"), ctrl.getAllLeaves);
router.put("/update/:id", auth, role("ADMIN"), ctrl.approveReject);

module.exports = router;
