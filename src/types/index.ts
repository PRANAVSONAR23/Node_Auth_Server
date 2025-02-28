import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

export interface TokenPayload {
  userId: number;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export enum OtpPurpose {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

export interface UserRegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}