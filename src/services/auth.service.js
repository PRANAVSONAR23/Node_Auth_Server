import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { OtpPurpose } from '../types/index.js';
import { generateOtp, saveOtp, verifyOtp } from './otp.service.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service.js';
import { createError } from '../utils/error.utils.js';
// Register a new user
export const registerUser = async (userData) => {
    const { email, password, firstName, lastName } = userData;
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw createError('User already exists with this email', 400);
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            verificationToken
        }
    });
    // Generate and save OTP
    const otp = generateOtp();
    await saveOtp(user.id, otp, OtpPurpose.EMAIL_VERIFICATION);
    // Send verification email
    await sendVerificationEmail(email, otp);
    return { userId: user.id, email: user.email };
};
// Login user
export const loginUser = async (loginData) => {
    const { email, password } = loginData;
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw createError('Invalid email or password', 401);
    }
    // Check if user is verified
    if (!user.isVerified) {
        throw createError('Please verify your email before logging in', 403);
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError('Invalid email or password', 401);
    }
    return user;
};
// Verify email with OTP
export const verifyEmail = async (email, otp) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw createError('User not found', 404);
    }
    // If already verified
    if (user.isVerified) {
        return { message: 'Email already verified' };
    }
    // Verify OTP
    const isOtpValid = await verifyOtp(user.id, otp, OtpPurpose.EMAIL_VERIFICATION);
    if (!isOtpValid) {
        throw createError('Invalid or expired OTP', 400);
    }
    // Update user's verification status
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationToken: null
        }
    });
    return { message: 'Email verified successfully' };
};
// Resend verification email
export const resendVerificationEmail = async (email) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw createError('User not found', 404);
    }
    // Check if already verified
    if (user.isVerified) {
        throw createError('Email already verified', 400);
    }
    // Generate and save new OTP
    const otp = generateOtp();
    await saveOtp(user.id, otp, OtpPurpose.EMAIL_VERIFICATION);
    // Send verification email
    await sendVerificationEmail(email, otp);
    return { message: 'Verification email sent successfully' };
};
// Send password reset OTP
export const requestPasswordReset = async (email) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw createError('User not found', 404);
    }
    // Generate and save OTP
    const otp = generateOtp();
    await saveOtp(user.id, otp, OtpPurpose.PASSWORD_RESET);
    // Send password reset email
    await sendPasswordResetEmail(email, otp);
    return { message: 'Password reset OTP sent to your email' };
};
// Verify password reset OTP
export const verifyPasswordResetOtp = async (email, otp) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw createError('User not found', 404);
    }
    // Verify OTP
    const isOtpValid = await verifyOtp(user.id, otp, OtpPurpose.PASSWORD_RESET);
    if (!isOtpValid) {
        throw createError('Invalid or expired OTP', 400);
    }
    return { message: 'OTP verified successfully', userId: user.id };
};
// Reset password
export const resetPassword = async (userId, newPassword) => {
    // Find user by ID
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw createError('User not found', 404);
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update user's password
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
    return { message: 'Password reset successfully' };
};
