import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/error.utils.js';

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (!email) {
    return next(createError('Email is required', 400));
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(createError('Please provide a valid email address', 400));
  }
  
  next();
};

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  
  if (!password) {
    return next(createError('Password is required', 400));
  }
  
  if (password.length < 8) {
    return next(createError('Password must be at least 8 characters long', 400));
  }
  
  // Basic password strength check - require at least one number and one special character
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
  if (!passwordRegex.test(password)) {
    return next(createError('Password must contain at least one number and one special character', 400));
  }
  
  next();
};

export const validateOtp = (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body;
  
  if (!otp) {
    return next(createError('OTP is required', 400));
  }
  
  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    return next(createError('OTP must be a 6-digit number', 400));
  }
  
  next();
};