import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// ============================================================================
// SMTP Service - Commented out for now; uncomment below when needed
// ============================================================================
/*
const transporter = env.SMTP_ENABLED
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;
*/
// Temporarily disabled so every user can access UI without SMTP errors/delays
const transporter: null = null;

const FROM = `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`;

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  // Always log and return without attempting SMTP transmission while commented out
  if (!transporter || !env.SMTP_ENABLED) {
    logger.info(`[Email disabled / SMTP Commented Out] Would have sent to ${to}: ${subject}`);
    return;
  }

  /*
  // Uncomment below when enabling SMTP Service:
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}`, err);
  }
  */
}

export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  await sendMail(
    email,
    `Welcome to HomeVistaa, ${name}!`,
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h1 style="color: #4f46e5;">Welcome to HomeVistaa 🏠</h1>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your account has been successfully created. You can now:</p>
      <ul>
        <li>Save your favorite properties</li>
        <li>List your property for sale or rent</li>
        <li>Set up custom search alerts</li>
      </ul>
      <p>Thank you for joining HomeVistaa!</p>
    </div>
    `
  );
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  await sendMail(
    email,
    'Reset Your HomeVistaa Password',
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        background: #4f46e5;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        margin: 16px 0;
      ">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
    `
  );
}

export async function sendInquiryConfirmation(name: string, email: string, propertyName?: string): Promise<void> {
  await sendMail(
    email,
    'Your Inquiry Has Been Received — HomeVistaa',
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2>Thank you, ${name}!</h2>
      <p>We've received your inquiry${propertyName ? ` regarding <strong>${propertyName}</strong>` : ''}.</p>
      <p>Our team will get back to you within 24 hours.</p>
    </div>
    `
  );
}

export async function sendListingSubmissionEmail(name: string, email: string, title: string): Promise<void> {
  await sendMail(
    email,
    'Property Listing Submitted — HomeVistaa',
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2>Listing Submitted Successfully</h2>
      <p>Hi ${name},</p>
      <p>Your property <strong>"${title}"</strong> has been submitted and is currently <strong>pending review</strong>.</p>
      <p>Our team will verify and publish it within 2–3 business days.</p>
    </div>
    `
  );
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // Always log OTP to the console/logger for ease of developer manual inspection
  logger.info(`[OTP Sent] 6-digit authentication code for ${email} is: ${otp}`);

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Outfit', sans-serif; background-color: #f9fafb; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e5e7eb;" border="0" cellspacing="0" cellpadding="0">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px 20px;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="background-color: #ffffff; border-radius: 10px; width: 44px; height: 44px; display: inline-block; vertical-align: middle;">
                      <span style="font-size: 24px; line-height: 44px; color: #6366f1;">🏠</span>
                    </td>
                    <td style="font-size: 24px; font-weight: 800; color: #ffffff; padding-left: 12px; font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; vertical-align: middle;">
                      HomeVistaa
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 40px 30px; text-align: left;">
                <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">Login Verification</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                  Hello,
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                  You requested a verification code to access your HomeVistaa account. Please use the following 6-digit OTP code to complete your login:
                </p>
                
                <!-- OTP Box -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center" style="background-color: #f3f4f6; border-radius: 12px; padding: 20px;">
                      <span style="font-size: 32px; font-weight: 800; color: #111827; letter-spacing: 6px; font-family: monospace;">${otp}</span>
                    </td>
                  </tr>
                </table>
                
                <p style="font-size: 13px; line-height: 1.5; color: #6b7280; margin: 0 0 24px 0;">
                  This OTP is valid for <strong>5 minutes</strong>. If you did not request this code, you can safely ignore this email.
                </p>
                
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                  <p style="font-size: 12px; font-weight: 600; color: #991b1b; margin: 0;">
                    ⚠️ Security Note: Never share this OTP with anyone. HomeVistaa support will never ask for your code.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">
                  © 2026 HomeVistaa Real Estate. All rights reserved.
                </p>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">
                  Need help? Contact our support team at <a href="mailto:support@homevistaa.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">support@homevistaa.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  await sendMail(email, 'Your HomeVistaa Login Verification Code', html);
}

