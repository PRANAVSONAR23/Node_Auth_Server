import express from 'express';
import { signup, signin, logout, refreshToken, verifyEmailWithOtp, resendVerificationOtp, forgotPassword, verifyResetOtp, createNewPassword, getCurrentUser } from '../controllers/auth.controller.js';
import { jwtAuthMiddleware } from '../middlewares/jwt.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import { validateEmail, validatePassword, validateOtp } from '../middlewares/validate.middleware.js';
const router = express.Router();
// Public routes
router.post('/signup', [authLimiter, validateEmail, validatePassword], signup);
router.post('/signin', [authLimiter, validateEmail], signin);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/verify-email', [validateEmail, validateOtp], verifyEmailWithOtp);
router.post('/resend-verification', [authLimiter, validateEmail], resendVerificationOtp);
router.post('/forgot-password', [authLimiter, validateEmail], forgotPassword);
router.post('/verify-reset-otp', [validateEmail, validateOtp], verifyResetOtp);
router.post('/reset-password', [validatePassword], createNewPassword);
// Protected routes
router.get('/me', jwtAuthMiddleware, getCurrentUser);
export default router;
