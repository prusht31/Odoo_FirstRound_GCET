import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";

// Apply Leave
export const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const userId = req.user.id;

        // Calculate Days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Create Leave
        const leave = await Leave.create({
            user: userId,
            leaveType,
            startDate,
            endDate,
            reason,
            days  // Storing days might be useful
        });

        // Deduct balance immediately
        await User.findByIdAndUpdate(userId, { $inc: { leaveBalance: -days } });

        res.status(201).json({ message: "Leave applied successfully", leave });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get Leaves
export const getLeaves = async (req, res) => {
    try {
        const { id, role } = req.user;
        let query = {};

        if (role === "hr") {
            // Can filter by status if needed, or by userId
            if (req.query.userId) query.user = req.query.userId;
            if (req.query.status) query.status = req.query.status;
        } else {
            query.user = id;
        }

        const leaves = await Leave.find(query).sort({ createdAt: -1 }).populate("user", "name email");
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Leave Status (Admin/HR)
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leaveId = req.params.id;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        // If rejecting, refund the balance (if it was pending or approved)
        if (status === "Rejected" && leave.status !== "Rejected") {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end - start);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            await User.findByIdAndUpdate(leave.user, { $inc: { leaveBalance: days } });
        }

        // If Approving, balance is already deducted on apply.
        // If we allowed re-approval from Rejected, we'd need to deduct again.
        if (status === "Approved" && leave.status === "Rejected") {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end - start);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            await User.findByIdAndUpdate(leave.user, { $inc: { leaveBalance: -days } });
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({ message: "Leave status updated", leave });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
