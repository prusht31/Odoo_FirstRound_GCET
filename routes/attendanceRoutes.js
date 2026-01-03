const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/attendanceController");

router.post("/checkin", auth, ctrl.checkIn);
router.post("/checkout", auth, ctrl.checkOut);
router.get("/all", auth, role("ADMIN"), ctrl.getAll);

module.exports = router;
