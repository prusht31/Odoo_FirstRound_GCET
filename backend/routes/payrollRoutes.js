const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/payrollController");

router.post("/add", auth, role("ADMIN"), ctrl.addPayroll);
router.get("/my", auth, ctrl.myPayroll);
router.get("/all", auth, role("ADMIN"), ctrl.allPayroll);
router.get("/slip/:id", auth, ctrl.generateSlip);

module.exports = router;
