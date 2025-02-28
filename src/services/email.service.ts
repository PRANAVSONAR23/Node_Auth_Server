import transporter from '../config/email.js';
import env from '../config/env.js';
import { EmailOptions } from '../types/index.js';

// Send email
export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Node_AUTH" <${env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, otp: string) => {
  const subject = 'Verify Your Email Address';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
      <h2>Email Verification</h2>
      <p>Thank you for registering! To complete your registration, please use the following OTP code:</p>
      <div style="background-color: #f8f8f8; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, otp: string) => {
  const subject = 'Reset Your Password';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Please use the following OTP code to reset your password:</p>
      <div style="background-color: #f8f8f8; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};