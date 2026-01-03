import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["hr", "employee"],
            default: "employee"
        },
        designation: {
            type: String,
            default: "Employee"
        },
        department: {
            type: String,
            default: "General"
        },
        phone: {
            type: String,
            default: ""
        },
        dob: { type: Date },
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        address: { type: String },
        profilePicture: { type: String, default: "" }, // URL or base64
        bankDetails: {
            accountNo: { type: String },
            ifsc: { type: String },
            pan: { type: String },
            uan: { type: String }
        },
        leaveBalance: {
            type: Number,
            default: 5
        },
        about: { type: String, default: "" },
        skills: [{ type: String }],
        interests: { type: String, default: "" }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
