import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Create Employee (Admin/HR only)
export const createEmployee = async (req, res) => {
    try {
        const { name, email, password, role, designation, department, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "employee",
            designation,
            department,
            phone
        });

        res.status(201).json({ message: "Employee created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Employees
export const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).select("-password");
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Single Employee
export const getEmployee = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Employee
export const updateEmployee = async (req, res) => {
    try {
        const { name, role, designation, department, phone } = req.body;

        // Build update object
        const updateFields = {};
        if (name) updateFields.name = name;
        if (role) updateFields.role = role;
        if (designation) updateFields.designation = designation;
        if (department) updateFields.department = department;
        if (phone) updateFields.phone = phone;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Employee updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Employee
export const deleteEmployee = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
