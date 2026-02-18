const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendResetCodeEmail } = require("../utils/emailService");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password });

        // Send welcome email (async - don't wait to respond to user)
        sendWelcomeEmail(user.email, user.name);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        // Send email
        await sendResetCodeEmail(user.email, resetCode);

        res.json({ message: "Reset code sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Reset Code
const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired code" });

        res.json({ message: "Code verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired code" });

        user.password = newPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (protected)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user (protected)
const deleteUser = async (req, res) => {
    try {
        // Check if user is deleting themselves
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: "You can only delete your own account" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, verifyResetCode, resetPassword, getUsers, deleteUser };