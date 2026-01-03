import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employee.controller.js";

const router = express.Router();

// Create Employee (HR)
router.post("/", authMiddleware, roleMiddleware(["hr"]), createEmployee);

// Get All Employees (HR)
router.get("/", authMiddleware, roleMiddleware(["hr"]), getEmployees);

// Get Single Employee (HR)
router.get("/:id", authMiddleware, roleMiddleware(["hr"]), getEmployee);

// Update Employee (HR)
router.put("/:id", authMiddleware, roleMiddleware(["hr"]), updateEmployee);

// Delete Employee (HR)
router.delete("/:id", authMiddleware, roleMiddleware(["hr"]), deleteEmployee);

export default router;
