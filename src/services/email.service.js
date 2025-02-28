import transporter from '../config/email.js';
import env from '../config/env.js';
// Send email
export const sendEmail = async (options) => {
    const mailOptions = {
        from: env.EMAIL_FROM,
        ...options
    };
    return transporter.sendMail(mailOptions);
};
// Send verification email
export const sendVerificationEmail = async (email, otp) => {
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
export const sendPasswordResetEmail = async (email, otp) => {
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
