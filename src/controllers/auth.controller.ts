import { Request, Response, NextFunction } from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  resendVerificationEmail,
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword
} from '../services/auth.service.js';
import { 
  generateTokens, 
  verifyRefreshToken, 
  invalidateRefreshToken, 
  invalidateAllUserTokens 
} from '../services/token.service.js';
import { AuthRequest } from '../types/index.js';
import { createError } from '../utils/error.utils.js';

// Register a new user
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const result = await registerUser({ email, password, firstName, lastName });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    const user = await loginUser({ email, password });
    
    // Generate access and refresh tokens
    const tokens = await generateTokens(
      user.id, 
      req.ip, 
      req.headers['user-agent']
    );
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (refreshToken) {
      // Invalidate refresh token
      await invalidateRefreshToken(refreshToken);
      
      // Clear cookie
      res.clearCookie('refreshToken');
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return next(createError('Refresh token not found', 401));
    }
    
    // Verify refresh token
    const userId = await verifyRefreshToken(refreshToken);
    
    // Generate new tokens
    const tokens = await generateTokens(
      userId, 
      req.ip, 
      req.headers['user-agent']
    );
    
    // Invalidate old refresh token
    await invalidateRefreshToken(refreshToken);
    
    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    next(error);
  }
}

  // Verify email with OTP
export const verifyEmailWithOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      
      const result = await verifyEmail(email, otp);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Resend verification email
  export const resendVerificationOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      
      const result = await resendVerificationEmail(email);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Request password reset
  export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      
      const result = await requestPasswordReset(email);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Verify password reset OTP
  export const verifyResetOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      
      const result = await verifyPasswordResetOtp(email, otp);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: { userId: result.userId }
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Reset password
  export const createNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, newPassword } = req.body;
      
      const result = await resetPassword(userId, newPassword);
      
      // Invalidate all refresh tokens for this user
      await invalidateAllUserTokens(userId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
}
  
  // Get current user profile
  export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      
      if (!user) {
        return next(createError('User not found', 404));
      }
      
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }