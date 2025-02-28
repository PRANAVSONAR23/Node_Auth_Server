import prisma from '../config/database.js';
import { OtpPurpose } from '../types/index.js';

// Generate 6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP to database
export const saveOtp = async (userId: number, code: string, purpose: OtpPurpose) => {
  // OTP expires in 10 minutes
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
  // Invalidate all previous unused OTPs for this user and purpose
  await prisma.otpCode.updateMany({
    where: {
      userId,
      purpose,
      isUsed: false,
      expiresAt: { gt: new Date() }
    },
    data: { isUsed: true }
  });
  
  // Create new OTP
  return prisma.otpCode.create({
    data: {
      code,
      expiresAt,
      purpose,
      userId
    }
  });
};

// Verify OTP
export const verifyOtp = async (userId: number, code: string, purpose: OtpPurpose) => {
  const otpCode = await prisma.otpCode.findFirst({
    where: {
      userId,
      code,
      purpose,
      isUsed: false,
      expiresAt: { gt: new Date() }
    }
  });
  
  if (!otpCode) {
    return false;
  }
  
  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otpCode.id },
    data: { isUsed: true }
  });
  
  return true;
};