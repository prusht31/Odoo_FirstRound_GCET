import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Protected route
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, phone, dob, gender, address, bankDetails, profilePicture } = req.body;
        // Profile picture update logic is simpler for Hackathon: just a URL string for now or omitted

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (dob) user.dob = dob;
        if (gender) user.gender = gender;
        if (address) user.address = address;
        if (profilePicture) user.profilePicture = profilePicture;
        if (req.body.about) user.about = req.body.about;
        if (req.body.interests) user.interests = req.body.interests;
        if (req.body.skills) user.skills = req.body.skills;
        if (bankDetails) {
            user.bankDetails = { ...user.bankDetails, ...bankDetails };
        }

        await user.save();
        res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
