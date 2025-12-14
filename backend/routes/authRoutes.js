const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/github', authController.githubAuth);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

// Protected routes (require authentication)
router.use(auth.protect);
router.get('/me', authController.getMe);

module.exports = router;
