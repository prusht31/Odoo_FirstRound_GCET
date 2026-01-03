import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    // Wage Definition
    monthlyWage: { type: Number, required: true, default: 0 },
    yearlyWage: { type: Number, required: true, default: 0 },
    wageType: { type: String, default: 'Fixed Wage' },
    workingDaysPerWeek: { type: Number, default: 5 },
    breakTime: { type: Number, default: 1 }, // hours

    // Components (Config & Calculated Values)
    components: {
        basic: {
            amount: { type: Number, default: 0 },
            percentage: { type: Number, default: 50 }, // typical default
            type: { type: String, enum: ['Fixed', 'Percentage'], default: 'Percentage' }
        },
        hra: {
            amount: { type: Number, default: 0 },
            percentage: { type: Number, default: 50 }, // of Basic
            type: { type: String, enum: ['Fixed', 'Percentage'], default: 'Percentage' }
        },
        standardAllowance: { type: Number, default: 0 }, // Fixed
        performanceBonus: { type: Number, default: 0 }, // Fixed
        lta: { type: Number, default: 0 }, // Fixed
        fixedAllowance: { type: Number, default: 0 } // Balance
    },

    // Deductions
    deductions: {
        pfEmployee: {
            amount: { type: Number, default: 0 },
            percentage: { type: Number, default: 12 } // of Basic
        },
        pfEmployer: {
            amount: { type: Number, default: 0 },
            percentage: { type: Number, default: 12 } // of Basic
        },
        professionalTax: { type: Number, default: 0 }
    },

    // Summary
    grossSalary: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
