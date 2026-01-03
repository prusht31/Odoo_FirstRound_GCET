import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { punchIn, punchOut, getAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/punch-in", authMiddleware, punchIn);
router.post("/punch-out", authMiddleware, punchOut);
router.get("/", authMiddleware, getAttendance);

export default router;
