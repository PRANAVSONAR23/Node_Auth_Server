import nodemailer from 'nodemailer';
import env from './env.js';

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE || 'gmail', // Default to Gmail
  host: env.EMAIL_HOST || 'smtp.gmail.com', // Default to Gmail's SMTP server
  port: env.EMAIL_PORT || 587, // Default to SSL port
  secure: false, // Default to true for SSL
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS // This should be an App Password if using Gmail
  },
  tls: {
    rejectUnauthorized: false // Helps in some development environments
  }
});

async function verifyTransporter() {
  try {
    const verification = await transporter.verify();
    console.log('SMTP connection established successfully');
    return verification;
  } catch (error :any) {
    console.error('SMTP connection failed:', error.message);
    throw error;
  }
}

export default transporter;