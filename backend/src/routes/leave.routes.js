import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { applyLeave, getLeaves, updateLeaveStatus } from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/", authMiddleware, applyLeave);
router.get("/", authMiddleware, getLeaves);
router.put("/:id", authMiddleware, roleMiddleware(["hr"]), updateLeaveStatus);

export default router;
