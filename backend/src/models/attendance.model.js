import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    punchIn: {
        type: Date,
        required: true
    },
    punchOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Half Day"],
        default: "Present"
    }
}, { timestamps: true });

// Ensure one record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
