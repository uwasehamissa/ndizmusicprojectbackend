const nodemailer = require('nodemailer');

// Create transporter - FIXED: createTransport instead of createTransporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Our App!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="${verificationUrl}" class="button">Verify Email Address</a>
                    </p>
                    <p>If the button doesn't work, copy and paste this link in your browser:</p>
                    <p>${verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                </div>
                <div class="footer">
                    <p>If you didn't create an account, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: email,
      subject: 'Welcome to Our App!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #10B981; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Email Verified Successfully!</h1>
                </div>
                <div class="content">
                    <h2>Welcome aboard, ${name}!</h2>
                    <p>Your email has been successfully verified and your account is now active.</p>
                    <p>You can now log in to your account and start using all the features of our application.</p>
                    <p>If you have any questions, feel free to contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Thank you for joining us!</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send login notification email
const sendLoginNotificationEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: email,
      subject: 'New Login Detected',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Login Detected</h1>
                </div>
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>We noticed a recent login to your account.</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p>If this was you, you can safely ignore this email.</p>
                    <p>If you don't recognize this activity, please contact our support team immediately and change your password.</p>
                </div>
                <div class="footer">
                    <p>Stay safe!</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Login notification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending login notification email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .button { background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>You requested to reset your password. Click the button below to create a new password:</p>
                    <p style="text-align: center;">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </p>
                    <p>If the button doesn't work, copy and paste this link in your browser:</p>
                    <p>${resetUrl}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request a password reset, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>For security reasons, this link is only valid for a limited time.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send password changed confirmation email
const sendPasswordChangedEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #10B981; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Changed</h1>
                </div>
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>Your password has been changed successfully.</p>
                    <p>If you made this change, you can safely ignore this email.</p>
                    <p>If you didn't change your password, please contact our support team immediately.</p>
                </div>
                <div class="footer">
                    <p>Stay secure!</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password changed email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw error;
  }
};

// Send account status change email
const sendStatusChangeEmail = async (email, name, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: email,
      subject: 'Account Status Updated',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Account Status Updated</h1>
                </div>
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>Your account status has been updated to <strong>${newStatus}</strong>.</p>
                    <p>This change was made by an administrator.</p>
                    ${newStatus === 'admin' ? 
                      '<p>You now have access to administrative features.</p>' : 
                      '<p>Your administrative privileges have been removed.</p>'
                    }
                    <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Thank you for using our service!</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status change email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending status change email:', error);
    throw error;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is correct');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendStatusChangeEmail,
  testEmailConfig
};