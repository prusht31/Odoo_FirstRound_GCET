import Salary from "../models/salary.model.js";

// Get Salary (Admin only can fetch any user, employees blocked via route - but we double check)
export const getSalary = async (req, res) => {
    try {
        const { id, role } = req.user;
        let targetUserId = id;

        // Only HR can view other employees' salaries
        if (role === 'hr' && req.query.userId) {
            targetUserId = req.query.userId;
        }

        const salary = await Salary.findOne({ user: targetUserId });
        if (!salary) {
            // Return empty structure if not found so frontend can populate defaults
            return res.status(200).json(null);
        }
        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const upsertSalary = async (req, res) => {
    try {
        const { userId, monthlyWage, yearlyWage, wageType, workingDaysPerWeek, breakTime, components, deductions, netSalary, grossSalary, totalDeductions, status } = req.body;

        // In a real app, we might re-calculate here to ensure integrity. 
        // For hackathon, trusting frontend calc but ensuring data structure is saved.

        const salaryData = {
            user: userId,
            monthlyWage,
            yearlyWage,
            wageType,
            workingDaysPerWeek,
            breakTime,
            components,
            deductions,
            grossSalary,
            totalDeductions,
            netSalary,
            status
        };

        const salary = await Salary.findOneAndUpdate(
            { user: userId },
            salaryData,
            { new: true, upsert: true }
        );

        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
