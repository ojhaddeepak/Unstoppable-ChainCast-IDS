const express = require('express');
const router = express.Router();
const { findUser, createUser, updateUser } = require('../utils/userStore');
const { sendOTP } = require('../services/emailService');

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = findUser(email);

    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, user: { name: user.name, email: user.email } });
});

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = createUser({ name, email, password });
        res.json({ success: true, user: { name: newUser.name, email: newUser.email } });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = findUser(email);

    if (!user) {
        // Return success even if user not found for security, or explicit error?
        // For dev simple:
        return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 mins

    updateUser(email, { otp, otpExpires: expires });
    await sendOTP(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
});

// Verify OTP & Reset Password
router.post('/verify-otp', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = findUser(email);

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Reset password and clear OTP
    updateUser(email, { password: newPassword, otp: null, otpExpires: null });

    res.json({ success: true, message: "Password reset successfully" });
});

module.exports = router;
