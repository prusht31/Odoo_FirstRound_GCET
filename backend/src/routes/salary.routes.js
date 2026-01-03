import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { getSalary, upsertSalary } from "../controllers/salary.controller.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["hr", "employee"]), getSalary);
router.post("/", authMiddleware, roleMiddleware(["hr"]), upsertSalary);

export default router;
