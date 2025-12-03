
// const nodemailer = require('nodemailer');

// // Create transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD
//     }
//   });
// };

// // Send verification email
// const sendVerificationEmail = async (email, name, token) => {
//   try {
//     const transporter = createTransporter();
    
//     const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: email,
//       subject: 'Verify Your Email Address',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Welcome to Our App!</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${name},</h2>
//                     <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
//                     <p style="text-align: center;">
//                         <a href="${verificationUrl}" class="button">Verify Email Address</a>
//                     </p>
//                     <p>If the button doesn't work, copy and paste this link in your browser:</p>
//                     <p>${verificationUrl}</p>
//                     <p>This link will expire in 24 hours.</p>
//                 </div>
//                 <div class="footer">
//                     <p>If you didn't create an account, please ignore this email.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Verification email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw error;
//   }
// };

// // Send welcome email
// const sendWelcomeEmail = async (email, name) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: email,
//       subject: 'Welcome to Our App!',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #10B981; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Email Verified Successfully!</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Welcome aboard, ${name}!</h2>
//                     <p>Your email has been successfully verified and your account is now active.</p>
//                     <p>You can now log in to your account and start using all the features of our application.</p>
//                     <p>If you have any questions, feel free to contact our support team.</p>
//                 </div>
//                 <div class="footer">
//                     <p>Thank you for joining us!</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Welcome email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending welcome email:', error);
//     throw error;
//   }
// };

// // Send login notification email
// const sendLoginNotificationEmail = async (email, name, ip, time, status) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: email,
//       subject: 'New Login Detected',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>New Login Detected</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${name},</h2>
//                     <p>We noticed a recent login to your account.</p>
//                     <p><strong>Time:</strong> ${time}</p>
//                     <p><strong>IP Address:</strong> ${ip}</p>
//                     <p><strong>Account Type:</strong> ${status}</p>
//                     <p>If this was you, you can safely ignore this email.</p>
//                     <p>If you don't recognize this activity, please contact our support team immediately and change your password.</p>
//                 </div>
//                 <div class="footer">
//                     <p>Stay safe!</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Login notification email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending login notification email:', error);
//     throw error;
//   }
// };

// // Send password reset email
// const sendPasswordResetEmail = async (email, name, token) => {
//   try {
//     const transporter = createTransporter();
    
//     const resetUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/reset-password/${token}`;
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: email,
//       subject: 'Password Reset Request',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .button { background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Password Reset</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${name},</h2>
//                     <p>You requested to reset your password. Click the button below to create a new password:</p>
//                     <p style="text-align: center;">
//                         <a href="${resetUrl}" class="button">Reset Password</a>
//                     </p>
//                     <p>If the button doesn't work, copy and paste this link in your browser:</p>
//                     <p>${resetUrl}</p>
//                     <p><strong>This link will expire in 1 hour.</strong></p>
//                     <p>If you didn't request a password reset, please ignore this email.</p>
//                 </div>
//                 <div class="footer">
//                     <p>For security reasons, this link is only valid for a limited time.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Password reset email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     throw error;
//   }
// };

// // Send password changed confirmation email
// const sendPasswordChangedEmail = async (email, name) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: email,
//       subject: 'Password Changed Successfully',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #10B981; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Password Changed</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${name},</h2>
//                     <p>Your password has been changed successfully.</p>
//                     <p>If you made this change, you can safely ignore this email.</p>
//                     <p>If you didn't change your password, please contact our support team immediately.</p>
//                 </div>
//                 <div class="footer">
//                     <p>Stay secure!</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Password changed email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending password changed email:', error);
//     throw error;
//   }
// };

// // Send account status change email
// const sendStatusChangeEmail = async (email, name, newStatus, reason) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: email,
//       subject: 'Account Status Updated',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Account Status Updated</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${name},</h2>
//                     <p>Your account status has been updated to <strong>${newStatus}</strong>.</p>
//                     ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
//                     <p>This change was made by an administrator.</p>
//                     ${newStatus === 'admin' ? 
//                       '<p>You now have access to administrative features.</p>' : 
//                       '<p>Your administrative privileges have been removed.</p>'
//                     }
//                     <p>If you have any questions, please contact our support team.</p>
//                 </div>
//                 <div class="footer">
//                     <p>Thank you for using our service!</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Status change email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending status change email:', error);
//     throw error;
//   }
// };

// // Test email configuration
// const testEmailConfig = async () => {
//   try {
//     const transporter = createTransporter();
//     await transporter.verify();
//     console.log('Email configuration is correct');
//     return true;
//   } catch (error) {
//     console.error('Email configuration error:', error);
//     throw error;
//   }
// };

// module.exports = {
//   sendVerificationEmail,
//   sendWelcomeEmail,
//   sendLoginNotificationEmail,
//   sendPasswordResetEmail,
//   sendPasswordChangedEmail,
//   sendStatusChangeEmail,
//   testEmailConfig
// };



const nodemailer = require('nodemailer');

// Create transporter function
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Helper functions for colors
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
};

const darkenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (
    0x1000000 +
    (R > 0 ? R : 0) * 0x10000 +
    (G > 0 ? G : 0) * 0x100 +
    (B > 0 ? B : 0)
  ).toString(16).slice(1);
};

const getInstrumentIcon = (instrument) => {
  const icons = {
    'guitar': '🎸',
    'piano': '🎹',
    'violin': '🎻',
    'drums': '🥁',
    'vocals': '🎤',
    'other': '🎵'
  };
  return icons[instrument.toLowerCase()] || '🎵';
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
const sendLoginNotificationEmail = async (email, name, ip, time, status, device = 'Unknown device') => {
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
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>IP Address:</strong> ${ip}</p>
                    <p><strong>Account Type:</strong> ${status}</p>
                    <p><strong>Device:</strong> ${device}</p>
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
const sendPasswordChangedEmail = async (email, name, ip = 'Unknown', time = new Date().toLocaleString()) => {
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
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>IP Address:</strong> ${ip}</p>
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
const sendStatusChangeEmail = async (email, name, newStatus, reason = '', adminName = 'System Administrator') => {
  try {
    const transporter = createTransporter();
    const statusColors = {
      'admin': '#8B5CF6',
      'user': '#3B82F6',
      'premium': '#F59E0B',
      'suspended': '#EF4444',
      'banned': '#DC2626',
      'verified': '#10B981'
    };
    
    const statusText = {
      'admin': 'Administrator',
      'user': 'Regular User',
      'premium': 'Premium User',
      'suspended': 'Suspended',
      'banned': 'Banned',
      'verified': 'Verified User'
    };
    
    const color = statusColors[newStatus] || '#6B7280';
    const statusDisplay = statusText[newStatus] || newStatus;
    
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
                .header { background: ${color}; color: white; padding: 20px; text-align: center; }
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
                    <p>Your account status has been updated to <strong style="color: ${color};">${statusDisplay}</strong>.</p>
                    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                    <p><strong>Updated By:</strong> ${adminName}</p>
                    <p>This change was made by an administrator.</p>
                    ${newStatus === 'admin' ? 
                      '<p>You now have access to administrative features.</p>' : 
                      newStatus === 'suspended' || newStatus === 'banned' ?
                      '<p>Your account access has been restricted. Please contact support for more information.</p>' :
                      '<p>Your account status has been updated. If you have any questions, please contact our support team.</p>'
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

// Send booking notification to admin
const sendBookingNotification = async (booking, adminEmail) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: adminEmail,
      subject: `New Booking: ${booking.name} - ${booking.instrument}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Booking Received</h1>
                </div>
                <div class="content">
                    <h2>Booking Details</h2>
                    <p><strong>Customer Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phone}</p>
                    <p><strong>Instrument:</strong> ${booking.instrument}</p>
                    <p><strong>Experience:</strong> ${booking.experience}</p>
                    <p><strong>Scheduled Date:</strong> ${new Date(booking.scheduledDate).toLocaleString()}</p>
                    <p><strong>Booking ID:</strong> ${booking._id}</p>
                    <p>Please login to the admin panel to review and manage this booking.</p>
                </div>
                <div class="footer">
                    <p>This is an automated notification from the booking system.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking notification sent to admin ${adminEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending booking notification:', error);
    throw error;
  }
};

// Send booking confirmation to user
const sendBookingConfirmation = async (booking) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: booking.email,
      subject: `Booking Confirmation: ${booking.instrument} Lessons`,
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
                    <h1>Booking Confirmed!</h1>
                </div>
                <div class="content">
                    <h2>${booking.instrument} Lessons</h2>
                    <p><strong>Student Name:</strong> ${booking.name}</p>
                    <p><strong>Lesson Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    <p><strong>Lesson Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString()}</p>
                    <p><strong>Instrument:</strong> ${booking.instrument}</p>
                    <p><strong>Experience Level:</strong> ${booking.experience}</p>
                    <p><strong>Status:</strong> ${booking.status}</p>
                    <p>Thank you for booking ${booking.instrument} lessons with us! We're excited to help you on your musical journey.</p>
                    <p><strong>Booking ID:</strong> ${booking._id}</p>
                    <p><strong>Cancellation policy:</strong> 24 hours notice required</p>
                    <p>We look forward to seeing you!</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The Music School Team</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation sent to ${booking.email}`);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }
};

// Send booking status update
const sendStatusUpdate = async (booking, oldStatus, newStatus) => {
  try {
    const transporter = createTransporter();
    const statusColors = {
      'pending': '#F59E0B',
      'confirmed': '#10B981',
      'cancelled': '#EF4444',
      'completed': '#3B82F6'
    };
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: booking.email,
      subject: `Booking Status Updated: ${booking.instrument}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
                .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Status Update</h1>
                </div>
                <div class="content">
                    <h2>Hello ${booking.name},</h2>
                    <p>Your booking status has been updated.</p>
                    <p><strong>Old Status:</strong> ${oldStatus}</p>
                    <p><strong>New Status:</strong> <span style="color: ${statusColors[newStatus] || '#374151'};">${newStatus}</span></p>
                    <p><strong>Instrument:</strong> ${booking.instrument}</p>
                    <p><strong>Scheduled Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    ${newStatus === 'confirmed' ? 
                      `<p>Your lesson is now confirmed! We look forward to seeing you on ${new Date(booking.scheduledDate).toLocaleDateString()}.</p>` : 
                      newStatus === 'cancelled' ?
                      `<p>Your booking has been cancelled. If this was a mistake or you'd like to reschedule, please contact us.</p>` :
                      newStatus === 'completed' ?
                      `<p>Thank you for completing your lesson! Consider booking your next session to continue your progress.</p>` :
                      ''
                    }
                    <p>If you have any questions about this status change, please don't hesitate to contact us.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The Music School Team</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${booking.email}`);
    return true;
  } catch (error) {
    console.error('Error sending status update:', error);
    throw error;
  }
};

// Send reminder email
const sendReminder = async (booking, reminderType, customMessage = null) => {
  try {
    const transporter = createTransporter();
    
    const subjectMap = {
      daily: `Reminder: Tomorrow's Lesson - ${booking.instrument}`,
      weekly: 'Weekly Schedule: Upcoming Lessons',
      monthly: 'Monthly Update: Your Lessons',
      yearly: 'Yearly Review: Thank You for Being Our Student'
    };
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to: booking.email,
      subject: subjectMap[reminderType] || 'Lesson Reminder',
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
                    <h1>${reminderType ? reminderType.charAt(0).toUpperCase() + reminderType.slice(1) : ''} Reminder</h1>
                </div>
                <div class="content">
                    <h2>Hello ${booking.name},</h2>
                    ${customMessage ? `<p><em>"${customMessage}"</em></p>` : ''}
                    <h3>Lesson Details</h3>
                    <p><strong>Instrument:</strong> ${booking.instrument}</p>
                    <p><strong>Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString()}</p>
                    <p><strong>Experience Level:</strong> ${booking.experience}</p>
                    <p><strong>Current Status:</strong> ${booking.status}</p>
                    ${reminderType === 'daily' ? 
                      `<p><strong>Tomorrow's Lesson:</strong> Please arrive 10 minutes early and bring your instrument (if applicable).</p>` : 
                      reminderType === 'weekly' ?
                      `<p><strong>This Week's Schedule:</strong> Review last week's materials and practice assigned exercises.</p>` :
                      reminderType === 'yearly' ?
                      `<p><strong>Yearly Milestone:</strong> Thank you for being our student this year! We appreciate your dedication.</p>` :
                      ''
                    }
                    <p>Thank you for choosing our music school!</p>
                </div>
                <div class="footer">
                    <p>Happy playing!<br>The Music School Team</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${booking.email}`);
    return true;
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
};

// Send custom email
const sendCustomEmail = async (to, subject, html, attachments = []) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
      to,
      subject,
      html,
      attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`Custom email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending custom email:', error);
    throw error;
  }
};

// Export all functions
module.exports = {
  testEmailConfig,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendStatusChangeEmail,
  sendBookingNotification,
  sendBookingConfirmation,
  sendStatusUpdate,
  sendReminder,
  sendCustomEmail
};