
// // const nodemailer = require('nodemailer');

// // // Create transporter
// // const createTransporter = () => {
// //   return nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //       user: process.env.SMTP_EMAIL,
// //       pass: process.env.SMTP_PASSWORD
// //     }
// //   });
// // };

// // // Send verification email
// // const sendVerificationEmail = async (email, name, token) => {
// //   try {
// //     const transporter = createTransporter();
    
// //     const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
// //     const mailOptions = {
// //       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
// //       to: email,
// //       subject: 'Verify Your Email Address',
// //       html: `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //             <style>
// //                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
// //                 .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
// //                 .content { padding: 20px; background: #f9f9f9; }
// //                 .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
// //                 .footer { padding: 20px; text-align: center; color: #666; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="container">
// //                 <div class="header">
// //                     <h1>Welcome to Our App!</h1>
// //                 </div>
// //                 <div class="content">
// //                     <h2>Hello ${name},</h2>
// //                     <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
// //                     <p style="text-align: center;">
// //                         <a href="${verificationUrl}" class="button">Verify Email Address</a>
// //                     </p>
// //                     <p>If the button doesn't work, copy and paste this link in your browser:</p>
// //                     <p>${verificationUrl}</p>
// //                     <p>This link will expire in 24 hours.</p>
// //                 </div>
// //                 <div class="footer">
// //                     <p>If you didn't create an account, please ignore this email.</p>
// //                 </div>
// //             </div>
// //         </body>
// //         </html>
// //       `
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Verification email sent to ${email}`);
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending verification email:', error);
// //     throw error;
// //   }
// // };

// // // Send welcome email
// // const sendWelcomeEmail = async (email, name) => {
// //   try {
// //     const transporter = createTransporter();
    
// //     const mailOptions = {
// //       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
// //       to: email,
// //       subject: 'Welcome to Our App!',
// //       html: `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //             <style>
// //                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
// //                 .header { background: #10B981; color: white; padding: 20px; text-align: center; }
// //                 .content { padding: 20px; background: #f9f9f9; }
// //                 .footer { padding: 20px; text-align: center; color: #666; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="container">
// //                 <div class="header">
// //                     <h1>Email Verified Successfully!</h1>
// //                 </div>
// //                 <div class="content">
// //                     <h2>Welcome aboard, ${name}!</h2>
// //                     <p>Your email has been successfully verified and your account is now active.</p>
// //                     <p>You can now log in to your account and start using all the features of our application.</p>
// //                     <p>If you have any questions, feel free to contact our support team.</p>
// //                 </div>
// //                 <div class="footer">
// //                     <p>Thank you for joining us!</p>
// //                 </div>
// //             </div>
// //         </body>
// //         </html>
// //       `
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Welcome email sent to ${email}`);
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending welcome email:', error);
// //     throw error;
// //   }
// // };

// // // Send login notification email
// // const sendLoginNotificationEmail = async (email, name, ip, time, status) => {
// //   try {
// //     const transporter = createTransporter();
    
// //     const mailOptions = {
// //       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
// //       to: email,
// //       subject: 'New Login Detected',
// //       html: `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //             <style>
// //                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
// //                 .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
// //                 .content { padding: 20px; background: #f9f9f9; }
// //                 .footer { padding: 20px; text-align: center; color: #666; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="container">
// //                 <div class="header">
// //                     <h1>New Login Detected</h1>
// //                 </div>
// //                 <div class="content">
// //                     <h2>Hello ${name},</h2>
// //                     <p>We noticed a recent login to your account.</p>
// //                     <p><strong>Time:</strong> ${time}</p>
// //                     <p><strong>IP Address:</strong> ${ip}</p>
// //                     <p><strong>Account Type:</strong> ${status}</p>
// //                     <p>If this was you, you can safely ignore this email.</p>
// //                     <p>If you don't recognize this activity, please contact our support team immediately and change your password.</p>
// //                 </div>
// //                 <div class="footer">
// //                     <p>Stay safe!</p>
// //                 </div>
// //             </div>
// //         </body>
// //         </html>
// //       `
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Login notification email sent to ${email}`);
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending login notification email:', error);
// //     throw error;
// //   }
// // };

// // // Send password reset email
// // const sendPasswordResetEmail = async (email, name, token) => {
// //   try {
// //     const transporter = createTransporter();
    
// //     const resetUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/reset-password/${token}`;
    
// //     const mailOptions = {
// //       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
// //       to: email,
// //       subject: 'Password Reset Request',
// //       html: `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //             <style>
// //                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
// //                 .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
// //                 .content { padding: 20px; background: #f9f9f9; }
// //                 .button { background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
// //                 .footer { padding: 20px; text-align: center; color: #666; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="container">
// //                 <div class="header">
// //                     <h1>Password Reset</h1>
// //                 </div>
// //                 <div class="content">
// //                     <h2>Hello ${name},</h2>
// //                     <p>You requested to reset your password. Click the button below to create a new password:</p>
// //                     <p style="text-align: center;">
// //                         <a href="${resetUrl}" class="button">Reset Password</a>
// //                     </p>
// //                     <p>If the button doesn't work, copy and paste this link in your browser:</p>
// //                     <p>${resetUrl}</p>
// //                     <p><strong>This link will expire in 1 hour.</strong></p>
// //                     <p>If you didn't request a password reset, please ignore this email.</p>
// //                 </div>
// //                 <div class="footer">
// //                     <p>For security reasons, this link is only valid for a limited time.</p>
// //                 </div>
// //             </div>
// //         </body>
// //         </html>
// //       `
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Password reset email sent to ${email}`);
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending password reset email:', error);
// //     throw error;
// //   }
// // };

// // // Send password changed confirmation email
// // const sendPasswordChangedEmail = async (email, name) => {
// //   try {
// //     const transporter = createTransporter();
    
// //     const mailOptions = {
// //       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
// //       to: email,
// //       subject: 'Password Changed Successfully',
// //       html: `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //             <style>
// //                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
// //                 .header { background: #10B981; color: white; padding: 20px; text-align: center; }
// //                 .content { padding: 20px; background: #f9f9f9; }
// //                 .footer { padding: 20px; text-align: center; color: #666; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="container">
// //                 <div class="header">
// //                     <h1>Password Changed</h1>
// //                 </div>
// //                 <div class="content">
// //                     <h2>Hello ${name},</h2>
// //                     <p>Your password has been changed successfully.</p>
// //                     <p>If you made this change, you can safely ignore this email.</p>
// //                     <p>If you didn't change your password, please contact our support team immediately.</p>
// //                 </div>
// //                 <div class="footer">
// //                     <p>Stay secure!</p>
// //                 </div>
// //             </div>
// //         </body>
// //         </html>
// //       `
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Password changed email sent to ${email}`);
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending password changed email:', error);
// //     throw error;
// //   }
// // };

// // // Send account status change email
// // const sendStatusChangeEmail = async (email, name, newStatus, reason) => {
// //   try {
// //     const transporter = createTransporter();
    
// //     const mailOptions = {
// //       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
// //       to: email,
// //       subject: 'Account Status Updated',
// //       html: `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //             <style>
// //                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
// //                 .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
// //                 .content { padding: 20px; background: #f9f9f9; }
// //                 .footer { padding: 20px; text-align: center; color: #666; }
// //             </style>
// //         </head>
// //         <body>
// //             <div class="container">
// //                 <div class="header">
// //                     <h1>Account Status Updated</h1>
// //                 </div>
// //                 <div class="content">
// //                     <h2>Hello ${name},</h2>
// //                     <p>Your account status has been updated to <strong>${newStatus}</strong>.</p>
// //                     ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
// //                     <p>This change was made by an administrator.</p>
// //                     ${newStatus === 'admin' ? 
// //                       '<p>You now have access to administrative features.</p>' : 
// //                       '<p>Your administrative privileges have been removed.</p>'
// //                     }
// //                     <p>If you have any questions, please contact our support team.</p>
// //                 </div>
// //                 <div class="footer">
// //                     <p>Thank you for using our service!</p>
// //                 </div>
// //             </div>
// //         </body>
// //         </html>
// //       `
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Status change email sent to ${email}`);
// //     return true;
// //   } catch (error) {
// //     console.error('Error sending status change email:', error);
// //     throw error;
// //   }
// // };

// // // Test email configuration
// // const testEmailConfig = async () => {
// //   try {
// //     const transporter = createTransporter();
// //     await transporter.verify();
// //     console.log('Email configuration is correct');
// //     return true;
// //   } catch (error) {
// //     console.error('Email configuration error:', error);
// //     throw error;
// //   }
// // };

// // module.exports = {
// //   sendVerificationEmail,
// //   sendWelcomeEmail,
// //   sendLoginNotificationEmail,
// //   sendPasswordResetEmail,
// //   sendPasswordChangedEmail,
// //   sendStatusChangeEmail,
// //   testEmailConfig
// // };



// const nodemailer = require('nodemailer');

// // Create transporter function
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: process.env.SMTP_SERVICE || 'gmail',
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD
//     }
//   });
// };

// // Helper functions for colors
// const lightenColor = (color, percent) => {
//   const num = parseInt(color.replace("#", ""), 16);
//   const amt = Math.round(2.55 * percent);
//   const R = (num >> 16) + amt;
//   const G = (num >> 8 & 0x00FF) + amt;
//   const B = (num & 0x0000FF) + amt;
//   return "#" + (
//     0x1000000 +
//     (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
//     (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
//     (B < 255 ? B < 1 ? 0 : B : 255)
//   ).toString(16).slice(1);
// };

// const darkenColor = (color, percent) => {
//   const num = parseInt(color.replace("#", ""), 16);
//   const amt = Math.round(2.55 * percent);
//   const R = (num >> 16) - amt;
//   const G = (num >> 8 & 0x00FF) - amt;
//   const B = (num & 0x0000FF) - amt;
//   return "#" + (
//     0x1000000 +
//     (R > 0 ? R : 0) * 0x10000 +
//     (G > 0 ? G : 0) * 0x100 +
//     (B > 0 ? B : 0)
//   ).toString(16).slice(1);
// };

// const getInstrumentIcon = (instrument) => {
//   const icons = {
//     'guitar': '🎸',
//     'piano': '🎹',
//     'violin': '🎻',
//     'drums': '🥁',
//     'vocals': '🎤',
//     'other': '🎵'
//   };
//   return icons[instrument.toLowerCase()] || '🎵';
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
// const sendLoginNotificationEmail = async (email, name, ip, time, status, device = 'Unknown device') => {
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
//                     <p><strong>Device:</strong> ${device}</p>
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
// const sendPasswordChangedEmail = async (email, name, ip = 'Unknown', time = new Date().toLocaleString()) => {
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
//                     <p><strong>Time:</strong> ${time}</p>
//                     <p><strong>IP Address:</strong> ${ip}</p>
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
// const sendStatusChangeEmail = async (email, name, newStatus, reason = '', adminName = 'System Administrator') => {
//   try {
//     const transporter = createTransporter();
//     const statusColors = {
//       'admin': '#8B5CF6',
//       'user': '#3B82F6',
//       'premium': '#F59E0B',
//       'suspended': '#EF4444',
//       'banned': '#DC2626',
//       'verified': '#10B981'
//     };
    
//     const statusText = {
//       'admin': 'Administrator',
//       'user': 'Regular User',
//       'premium': 'Premium User',
//       'suspended': 'Suspended',
//       'banned': 'Banned',
//       'verified': 'Verified User'
//     };
    
//     const color = statusColors[newStatus] || '#6B7280';
//     const statusDisplay = statusText[newStatus] || newStatus;
    
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
//                 .header { background: ${color}; color: white; padding: 20px; text-align: center; }
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
//                     <p>Your account status has been updated to <strong style="color: ${color};">${statusDisplay}</strong>.</p>
//                     ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
//                     <p><strong>Updated By:</strong> ${adminName}</p>
//                     <p>This change was made by an administrator.</p>
//                     ${newStatus === 'admin' ? 
//                       '<p>You now have access to administrative features.</p>' : 
//                       newStatus === 'suspended' || newStatus === 'banned' ?
//                       '<p>Your account access has been restricted. Please contact support for more information.</p>' :
//                       '<p>Your account status has been updated. If you have any questions, please contact our support team.</p>'
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

// // Send booking notification to admin
// const sendBookingNotification = async (booking, adminEmail) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: adminEmail,
//       subject: `New Booking: ${booking.name} - ${booking.instrument}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>New Booking Received</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Booking Details</h2>
//                     <p><strong>Customer Name:</strong> ${booking.name}</p>
//                     <p><strong>Email:</strong> ${booking.email}</p>
//                     <p><strong>Phone:</strong> ${booking.phone}</p>
//                     <p><strong>Instrument:</strong> ${booking.instrument}</p>
//                     <p><strong>Experience:</strong> ${booking.experience}</p>
//                     <p><strong>Scheduled Date:</strong> ${new Date(booking.scheduledDate).toLocaleString()}</p>
//                     <p><strong>Booking ID:</strong> ${booking._id}</p>
//                     <p>Please login to the admin panel to review and manage this booking.</p>
//                 </div>
//                 <div class="footer">
//                     <p>This is an automated notification from the booking system.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Booking notification sent to admin ${adminEmail}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending booking notification:', error);
//     throw error;
//   }
// };

// // Send booking confirmation to user
// const sendBookingConfirmation = async (booking) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: booking.email,
//       subject: `Booking Confirmation: ${booking.instrument} Lessons`,
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
//                     <h1>Booking Confirmed!</h1>
//                 </div>
//                 <div class="content">
//                     <h2>${booking.instrument} Lessons</h2>
//                     <p><strong>Student Name:</strong> ${booking.name}</p>
//                     <p><strong>Lesson Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
//                     <p><strong>Lesson Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString()}</p>
//                     <p><strong>Instrument:</strong> ${booking.instrument}</p>
//                     <p><strong>Experience Level:</strong> ${booking.experience}</p>
//                     <p><strong>Status:</strong> ${booking.status}</p>
//                     <p>Thank you for booking ${booking.instrument} lessons with us! We're excited to help you on your musical journey.</p>
//                     <p><strong>Booking ID:</strong> ${booking._id}</p>
//                     <p><strong>Cancellation policy:</strong> 24 hours notice required</p>
//                     <p>We look forward to seeing you!</p>
//                 </div>
//                 <div class="footer">
//                     <p>Best regards,<br>The Music School Team</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Booking confirmation sent to ${booking.email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending booking confirmation:', error);
//     throw error;
//   }
// };

// // Send booking status update
// const sendStatusUpdate = async (booking, oldStatus, newStatus) => {
//   try {
//     const transporter = createTransporter();
//     const statusColors = {
//       'pending': '#F59E0B',
//       'confirmed': '#10B981',
//       'cancelled': '#EF4444',
//       'completed': '#3B82F6'
//     };
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: booking.email,
//       subject: `Booking Status Updated: ${booking.instrument}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
//                 .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
//                 .content { padding: 20px; background: #f9f9f9; }
//                 .footer { padding: 20px; text-align: center; color: #666; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Booking Status Update</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${booking.name},</h2>
//                     <p>Your booking status has been updated.</p>
//                     <p><strong>Old Status:</strong> ${oldStatus}</p>
//                     <p><strong>New Status:</strong> <span style="color: ${statusColors[newStatus] || '#374151'};">${newStatus}</span></p>
//                     <p><strong>Instrument:</strong> ${booking.instrument}</p>
//                     <p><strong>Scheduled Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
//                     ${newStatus === 'confirmed' ? 
//                       `<p>Your lesson is now confirmed! We look forward to seeing you on ${new Date(booking.scheduledDate).toLocaleDateString()}.</p>` : 
//                       newStatus === 'cancelled' ?
//                       `<p>Your booking has been cancelled. If this was a mistake or you'd like to reschedule, please contact us.</p>` :
//                       newStatus === 'completed' ?
//                       `<p>Thank you for completing your lesson! Consider booking your next session to continue your progress.</p>` :
//                       ''
//                     }
//                     <p>If you have any questions about this status change, please don't hesitate to contact us.</p>
//                 </div>
//                 <div class="footer">
//                     <p>Best regards,<br>The Music School Team</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Status update email sent to ${booking.email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending status update:', error);
//     throw error;
//   }
// };

// // Send reminder email
// const sendReminder = async (booking, reminderType, customMessage = null) => {
//   try {
//     const transporter = createTransporter();
    
//     const subjectMap = {
//       daily: `Reminder: Tomorrow's Lesson - ${booking.instrument}`,
//       weekly: 'Weekly Schedule: Upcoming Lessons',
//       monthly: 'Monthly Update: Your Lessons',
//       yearly: 'Yearly Review: Thank You for Being Our Student'
//     };
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to: booking.email,
//       subject: subjectMap[reminderType] || 'Lesson Reminder',
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
//                     <h1>${reminderType ? reminderType.charAt(0).toUpperCase() + reminderType.slice(1) : ''} Reminder</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${booking.name},</h2>
//                     ${customMessage ? `<p><em>"${customMessage}"</em></p>` : ''}
//                     <h3>Lesson Details</h3>
//                     <p><strong>Instrument:</strong> ${booking.instrument}</p>
//                     <p><strong>Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString()}</p>
//                     <p><strong>Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString()}</p>
//                     <p><strong>Experience Level:</strong> ${booking.experience}</p>
//                     <p><strong>Current Status:</strong> ${booking.status}</p>
//                     ${reminderType === 'daily' ? 
//                       `<p><strong>Tomorrow's Lesson:</strong> Please arrive 10 minutes early and bring your instrument (if applicable).</p>` : 
//                       reminderType === 'weekly' ?
//                       `<p><strong>This Week's Schedule:</strong> Review last week's materials and practice assigned exercises.</p>` :
//                       reminderType === 'yearly' ?
//                       `<p><strong>Yearly Milestone:</strong> Thank you for being our student this year! We appreciate your dedication.</p>` :
//                       ''
//                     }
//                     <p>Thank you for choosing our music school!</p>
//                 </div>
//                 <div class="footer">
//                     <p>Happy playing!<br>The Music School Team</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Reminder email sent to ${booking.email}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending reminder:', error);
//     throw error;
//   }
// };

// // Send custom email
// const sendCustomEmail = async (to, subject, html, attachments = []) => {
//   try {
//     const transporter = createTransporter();
    
//     const mailOptions = {
//       from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL,
//       to,
//       subject,
//       html,
//       attachments
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Custom email sent to ${to}`);
//     return true;
//   } catch (error) {
//     console.error('Error sending custom email:', error);
//     throw error;
//   }
// };

// // Export all functions
// module.exports = {
//   testEmailConfig,
//   sendVerificationEmail,
//   sendWelcomeEmail,
//   sendLoginNotificationEmail,
//   sendPasswordResetEmail,
//   sendPasswordChangedEmail,
//   sendStatusChangeEmail,
//   sendBookingNotification,
//   sendBookingConfirmation,
//   sendStatusUpdate,
//   sendReminder,
//   sendCustomEmail
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

class EmailService {
  // Test email configuration
  static async testEmailConfig() {
    try {
      const transporter = createTransporter();
      await transporter.verify();
      console.log('Email configuration is correct');
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      throw error;
    }
  }

  // Send verification email
  static async sendVerificationEmail(email, name, token) {
    try {
      const transporter = createTransporter();
      const verificationUrl = `${process.env.CLIENT_URL || process.env.FRONTEND_URL}/verify-email/${token}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Email Address - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .music-icon { font-size: 48px; margin: 20px 0; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🎵 Welcome to NdziNote Music School!</h1>
                  </div>
                  <div class="content">
                      <div class="music-icon">🎶</div>
                      <h2>Hello ${name},</h2>
                      <p>Thank you for registering with NdziNote Music School. We're excited to have you join our musical community!</p>
                      <p>Please verify your email address by clicking the button below:</p>
                      <p style="text-align: center;">
                          <a href="${verificationUrl}" class="button">Verify Email Address</a>
                      </p>
                      <p>If the button doesn't work, copy and paste this link in your browser:</p>
                      <p><code>${verificationUrl}</code></p>
                      <p><strong>This link will expire in 24 hours.</strong></p>
                      <p>Once verified, you'll have access to book lessons, track your progress, and join our musical community!</p>
                  </div>
                  <div class="footer">
                      <p>If you didn't create an account with NdziNote Music School, please ignore this email.</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(email, name) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to NdziNote Music School!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #10B981 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 25px 0; }
                  .feature-item { background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #ddd; }
                  .icon { font-size: 24px; margin-bottom: 10px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🎵 Email Verified Successfully!</h1>
                  </div>
                  <div class="content">
                      <h2>Welcome aboard, ${name}! 🎉</h2>
                      <p>Your email has been successfully verified and your account is now active at NdziNote Music School.</p>
                      <p>You can now log in to your account and start exploring:</p>
                      
                      <div class="features">
                          <div class="feature-item">
                              <div class="icon">🎸</div>
                              <h3>Book Lessons</h3>
                              <p>Schedule your music lessons</p>
                          </div>
                          <div class="feature-item">
                              <div class="icon">📅</div>
                              <h3>Track Progress</h3>
                              <p>Monitor your learning journey</p>
                          </div>
                          <div class="feature-item">
                              <div class="icon">🎹</div>
                              <h3>Multiple Instruments</h3>
                              <p>Learn various instruments</p>
                          </div>
                          <div class="feature-item">
                              <div class="icon">👨‍🏫</div>
                              <h3>Expert Teachers</h3>
                              <p>Learn from professionals</p>
                          </div>
                      </div>
                      
                      <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                      
                      <p style="text-align: center; margin-top: 25px;">
                          <a href="${process.env.FRONTEND_URL || process.env.CLIENT_URL}/dashboard" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                              Go to Your Dashboard
                          </a>
                      </p>
                  </div>
                  <div class="footer">
                      <p>Thank you for choosing NdziNote Music School!</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Send login notification email
  static async sendLoginNotificationEmail(email, name, ip, time, status, device = 'Unknown device') {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: email,
        subject: 'New Login Detected - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .security-info { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
                  .warning { color: #DC2626; font-weight: bold; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🔒 New Login Detected</h1>
                  </div>
                  <div class="content">
                      <h2>Hello ${name},</h2>
                      <p>We noticed a recent login to your NdziNote Music School account.</p>
                      
                      <div class="security-info">
                          <h3>Login Details:</h3>
                          <p><strong>🎵 Account:</strong> NdziNote Music School</p>
                          <p><strong>⏰ Time:</strong> ${time}</p>
                          <p><strong>📍 IP Address:</strong> ${ip}</p>
                          <p><strong>📱 Device:</strong> ${device}</p>
                          <p><strong>👤 Account Type:</strong> ${status}</p>
                      </div>
                      
                      <p>If this was you, you can safely ignore this email.</p>
                      
                      <p class="warning">⚠️ If you don't recognize this activity:</p>
                      <ul>
                          <li>Change your password immediately</li>
                          <li>Contact our support team</li>
                          <li>Review your account activity</li>
                      </ul>
                      
                      <p>You can manage your account security settings from your dashboard.</p>
                  </div>
                  <div class="footer">
                      <p>Stay safe and keep making music!</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Login notification email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending login notification email:', error);
      throw error;
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email, name, token) {
    try {
      const transporter = createTransporter();
      const resetUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/reset-password/${token}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .button { background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .security-note { background: #FEF2F2; border: 1px solid #FECACA; padding: 15px; margin: 20px 0; border-radius: 5px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🔑 Password Reset</h1>
                  </div>
                  <div class="content">
                      <h2>Hello ${name},</h2>
                      <p>You requested to reset your password for your NdziNote Music School account.</p>
                      <p>Click the button below to create a new password:</p>
                      <p style="text-align: center;">
                          <a href="${resetUrl}" class="button">Reset Password</a>
                      </p>
                      <p>If the button doesn't work, copy and paste this link in your browser:</p>
                      <p><code>${resetUrl}</code></p>
                      
                      <div class="security-note">
                          <p><strong>⚠️ Security Notice:</strong></p>
                          <p>• This link will expire in 1 hour</p>
                          <p>• Never share your password with anyone</p>
                          <p>• Our team will never ask for your password</p>
                      </div>
                      
                      <p>If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
                  </div>
                  <div class="footer">
                      <p>For security reasons, this link is only valid for a limited time.</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Send password changed confirmation email
  static async sendPasswordChangedEmail(email, name, ip = 'Unknown', time = new Date().toLocaleString()) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Changed Successfully - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #10B981 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .security-info { background: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 8px; }
                  .warning { color: #DC2626; font-weight: bold; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>✅ Password Changed</h1>
                  </div>
                  <div class="content">
                      <h2>Hello ${name},</h2>
                      <p>Your NdziNote Music School account password has been changed successfully.</p>
                      
                      <div class="security-info">
                          <h3>Change Details:</h3>
                          <p><strong>⏰ Time:</strong> ${time}</p>
                          <p><strong>📍 IP Address:</strong> ${ip}</p>
                          <p><strong>🎵 Account:</strong> NdziNote Music School</p>
                      </div>
                      
                      <p>If you made this change, you can safely ignore this email.</p>
                      
                      <p class="warning">If you didn't change your password:</p>
                      <ul>
                          <li>Use the "Forgot Password" feature immediately</li>
                          <li>Contact our support team</li>
                          <li>Check your recent account activity</li>
                      </ul>
                      
                      <p>You can review your account security settings from your dashboard.</p>
                  </div>
                  <div class="footer">
                      <p>Stay secure and keep making beautiful music!</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Password changed email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password changed email:', error);
      throw error;
    }
  }

  // Send account status change email
  static async sendStatusChangeEmail(email, name, newStatus, reason = '', adminName = 'NdziNote Administrator') {
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
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: email,
        subject: 'Account Status Updated - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, ${color} 0%, ${darkenColor(color, 20)} 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .status-badge { display: inline-block; padding: 5px 15px; background: ${color}; color: white; border-radius: 20px; font-weight: bold; }
                  .info-box { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🎵 Account Status Updated</h1>
                  </div>
                  <div class="content">
                      <h2>Hello ${name},</h2>
                      <p>Your NdziNote Music School account status has been updated.</p>
                      
                      <div class="info-box">
                          <h3>Status Details:</h3>
                          <p><strong>New Status:</strong> <span class="status-badge">${statusDisplay}</span></p>
                          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                          <p><strong>Updated By:</strong> ${adminName}</p>
                          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                      </div>
                      
                      ${newStatus === 'admin' ? 
                        '<p>🎉 Congratulations! You now have access to administrative features and can help manage the music school.</p>' : 
                        newStatus === 'premium' ?
                        '<p>🎉 Welcome to Premium! You now have access to exclusive features, priority scheduling, and additional learning resources.</p>' :
                        newStatus === 'suspended' || newStatus === 'banned' ?
                        '<p>⚠️ Your account access has been restricted. Please contact support for more information.</p>' :
                        newStatus === 'verified' ?
                        '<p>✅ Your account has been verified! Enjoy full access to all features.</p>' :
                        '<p>Your account status has been updated. If you have any questions, please contact our support team.</p>'
                      }
                      
                      <p>If you believe this is a mistake or have any questions, please contact our support team immediately.</p>
                  </div>
                  <div class="footer">
                      <p>Thank you for being part of NdziNote Music School!</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Status change email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending status change email:', error);
      throw error;
    }
  }

  // Send booking notification to admin
  static async sendBookingNotification(booking, adminEmail) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: adminEmail,
        subject: `📅 New Booking: ${booking.name} - ${booking.instrument}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .booking-details { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
                  .instrument-icon { font-size: 32px; margin-right: 10px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>📅 New Booking Received</h1>
                  </div>
                  <div class="content">
                      <h2><span class="instrument-icon">${getInstrumentIcon(booking.instrument)}</span> ${booking.instrument} Lesson</h2>
                      
                      <div class="booking-details">
                          <h3>Booking Details:</h3>
                          <p><strong>👤 Student Name:</strong> ${booking.name}</p>
                          <p><strong>📧 Email:</strong> ${booking.email}</p>
                          <p><strong>📞 Phone:</strong> ${booking.phone}</p>
                          <p><strong>🎵 Instrument:</strong> ${booking.instrument}</p>
                          <p><strong>📊 Experience Level:</strong> ${booking.experience}</p>
                          <p><strong>📅 Scheduled Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p><strong>⏰ Scheduled Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          <p><strong>🆔 Booking ID:</strong> ${booking._id}</p>
                          <p><strong>📝 Status:</strong> ${booking.status || 'Pending'}</p>
                      </div>
                      
                      <p>Please login to the admin panel to review and manage this booking.</p>
                      
                      <p style="text-align: center; margin-top: 25px;">
                          <a href="${process.env.ADMIN_URL || process.env.FRONTEND_URL}/admin/bookings" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                              View in Admin Panel
                          </a>
                      </p>
                  </div>
                  <div class="footer">
                      <p>This is an automated notification from NdziNote Music School booking system.</p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Booking notification sent to admin ${adminEmail}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending booking notification:', error);
      throw error;
    }
  }

  // Send booking confirmation to user
  static async sendBookingConfirmation(booking) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: booking.email,
        subject: `✅ Booking Confirmation: ${booking.instrument} Lessons`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10B981 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .booking-card { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                  .instrument-icon { font-size: 40px; margin-bottom: 15px; }
                  .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0; }
                  .detail-item { padding: 10px; background: #f8f9fa; border-radius: 5px; }
                  .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🎵 NdziNote Music School</h1>
                      <p>Booking Confirmed!</p>
                  </div>
                  <div class="content">
                      <div class="instrument-icon">${getInstrumentIcon(booking.instrument)}</div>
                      <h2>${booking.instrument} Lessons</h2>
                      
                      <div class="booking-card">
                          <h3>Your Lesson Details</h3>
                          <div class="details-grid">
                              <div class="detail-item">
                                  <strong>Student Name:</strong><br>
                                  ${booking.name}
                              </div>
                              <div class="detail-item">
                                  <strong>Lesson Date:</strong><br>
                                  ${new Date(booking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                              <div class="detail-item">
                                  <strong>Lesson Time:</strong><br>
                                  ${new Date(booking.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div class="detail-item">
                                  <strong>Instrument:</strong><br>
                                  ${booking.instrument}
                              </div>
                              <div class="detail-item">
                                  <strong>Experience Level:</strong><br>
                                  ${booking.experience}
                              </div>
                              <div class="detail-item">
                                  <strong>Status:</strong><br>
                                  ${booking.status || 'Confirmed'}
                              </div>
                          </div>
                          
                          <p><strong>Booking ID:</strong> ${booking._id}</p>
                      </div>
                      
                      <p>🎉 Thank you for booking ${booking.instrument} lessons with NdziNote Music School! We're excited to help you on your musical journey.</p>
                      
                      <h3>📋 Important Information:</h3>
                      <ul>
                          <li>📍 <strong>Location:</strong> ${booking.location || 'Main Campus (address will be sent separately)'}</li>
                          <li>⏰ <strong>Arrival Time:</strong> Please arrive 10-15 minutes early</li>
                          <li>🎒 <strong>What to Bring:</strong> Your instrument (if applicable), notebook, and water</li>
                          <li>❌ <strong>Cancellation Policy:</strong> 24 hours notice required for cancellations</li>
                      </ul>
                      
                      <p style="text-align: center;">
                          <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" class="button">View Booking Details</a>
                      </p>
                      
                      <p>If you need to reschedule or have any questions, please contact us at least 24 hours before your lesson.</p>
                      
                      <p>We look forward to seeing you and helping you make beautiful music!</p>
                  </div>
                  <div class="footer">
                      <p>Best regards,<br><strong>The NdziNote Music School Team</strong></p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                      <p>This email was sent to ${booking.email}</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Booking confirmation sent to ${booking.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw error;
    }
  }

  // Send booking status update
  static async sendStatusUpdate(booking, oldStatus, newStatus) {
    try {
      const transporter = createTransporter();
      const statusColors = {
        'pending': '#F59E0B',
        'confirmed': '#10B981',
        'cancelled': '#EF4444',
        'completed': '#3B82F6',
        'rescheduled': '#8B5CF6'
      };
      
      const statusMessages = {
        'pending': 'is pending review',
        'confirmed': 'has been confirmed',
        'cancelled': 'has been cancelled',
        'completed': 'has been marked as completed',
        'rescheduled': 'has been rescheduled'
      };
      
      const color = statusColors[newStatus] || '#374151';
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: booking.email,
        subject: `📋 Booking Status Updated: ${booking.instrument}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, ${color} 0%, ${darkenColor(color, 20)} 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .status-change { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
                  .old-status { color: #6B7280; text-decoration: line-through; }
                  .new-status { color: ${color}; font-weight: bold; font-size: 1.2em; }
                  .next-steps { background: #F0F9FF; border: 1px solid #E0F2FE; padding: 15px; margin: 20px 0; border-radius: 5px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>📋 Booking Status Update</h1>
                  </div>
                  <div class="content">
                      <h2>Hello ${booking.name},</h2>
                      <p>Your ${booking.instrument} lesson booking ${statusMessages[newStatus] || 'status has been updated'}.</p>
                      
                      <div class="status-change">
                          <p><span class="old-status">${oldStatus.toUpperCase()}</span> → <span class="new-status">${newStatus.toUpperCase()}</span></p>
                      </div>
                      
                      <h3>Booking Details:</h3>
                      <p><strong>🎵 Instrument:</strong> ${booking.instrument}</p>
                      <p><strong>📅 Scheduled Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>⏰ Scheduled Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p><strong>🆔 Booking ID:</strong> ${booking._id}</p>
                      
                      <div class="next-steps">
                          <h4>🎯 Next Steps:</h4>
                          ${newStatus === 'confirmed' ? 
                            `<p>✅ Your lesson is confirmed! We look forward to seeing you on ${new Date(booking.scheduledDate).toLocaleDateString()}.</p>
                             <p>Please arrive 10 minutes early and bring your instrument.</p>` : 
                            newStatus === 'cancelled' ?
                            `<p>❌ Your booking has been cancelled.</p>
                             <p>If this was a mistake or you'd like to reschedule, please contact us as soon as possible.</p>` :
                            newStatus === 'completed' ?
                            `<p>🎉 Thank you for completing your lesson!</p>
                             <p>Consider booking your next session to continue your progress. Practice makes perfect!</p>` :
                            newStatus === 'rescheduled' ?
                            `<p>🔄 Your lesson has been rescheduled.</p>
                             <p>Please check your booking details for the new date and time.</p>` :
                            `<p>Your booking is currently ${newStatus}. We'll notify you of any further updates.</p>`
                          }
                      </div>
                      
                      ${newStatus !== 'cancelled' ? `
                        <p style="text-align: center; margin-top: 25px;">
                            <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" style="background: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                View Booking Details
                            </a>
                        </p>
                      ` : ''}
                      
                      <p>If you have any questions about this status change, please don't hesitate to contact us.</p>
                  </div>
                  <div class="footer">
                      <p>Best regards,<br><strong>The NdziNote Music School Team</strong></p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Status update email sent to ${booking.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending status update:', error);
      throw error;
    }
  }

  // Send reminder email
  static async sendReminder(booking, reminderType, customMessage = null) {
    try {
      const transporter = createTransporter();
      
      const subjectMap = {
        daily: `⏰ Reminder: Tomorrow's ${booking.instrument} Lesson`,
        weekly: '📅 Weekly Schedule: Upcoming Lessons',
        monthly: '📊 Monthly Update: Your Music Journey',
        yearly: '🎉 Yearly Review: Thank You for Being Our Student'
      };
      
      const titleMap = {
        daily: 'Daily Reminder',
        weekly: 'Weekly Schedule',
        monthly: 'Monthly Update',
        yearly: 'Yearly Review'
      };
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: booking.email,
        subject: subjectMap[reminderType] || '🎵 Lesson Reminder',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .reminder-card { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
                  .custom-message { background: #F0F9FF; border: 1px solid #E0F2FE; padding: 15px; margin: 15px 0; border-radius: 5px; font-style: italic; }
                  .practice-tips { background: #F0FDF4; border: 1px solid #DCFCE7; padding: 15px; margin: 20px 0; border-radius: 5px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>⏰ ${titleMap[reminderType] || 'Reminder'}</h1>
                      <p>NdziNote Music School</p>
                  </div>
                  <div class="content">
                      <h2>Hello ${booking.name},</h2>
                      
                      ${customMessage ? `
                        <div class="custom-message">
                            <p>"${customMessage}"</p>
                        </div>
                      ` : ''}
                      
                      <div class="reminder-card">
                          <h3>🎵 Lesson Details</h3>
                          <p><strong>Instrument:</strong> ${booking.instrument}</p>
                          <p><strong>Date:</strong> ${new Date(booking.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p><strong>Time:</strong> ${new Date(booking.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          <p><strong>Experience Level:</strong> ${booking.experience}</p>
                          <p><strong>Current Status:</strong> ${booking.status}</p>
                          <p><strong>Booking ID:</strong> ${booking._id}</p>
                      </div>
                      
                      ${reminderType === 'daily' ? 
                        `<div class="practice-tips">
                            <h4>🎯 Tips for Tomorrow's Lesson:</h4>
                            <ul>
                                <li>Review last week's materials and practice exercises</li>
                                <li>Prepare any questions you have for your instructor</li>
                                <li>Bring your instrument, notebook, and water bottle</li>
                                <li>Arrive 10-15 minutes early to get settled</li>
                            </ul>
                            <p><strong>Location:</strong> ${booking.location || 'Main Campus'}</p>
                        </div>` : 
                        reminderType === 'weekly' ?
                        `<div class="practice-tips">
                            <h4>📚 This Week's Focus:</h4>
                            <ul>
                                <li>Practice for at least 15-30 minutes daily</li>
                                <li>Focus on the techniques covered in your last lesson</li>
                                <li>Use our online resources for extra practice</li>
                                <li>Prepare questions for your next lesson</li>
                            </ul>
                        </div>` :
                        reminderType === 'monthly' ?
                        `<div class="practice-tips">
                            <h4>📊 Monthly Progress Check:</h4>
                            <p>Take a moment to reflect on your progress this month:</p>
                            <ul>
                                <li>What new skills have you learned?</li>
                                <li>What challenges are you overcoming?</li>
                                <li>What goals would you like to achieve next month?</li>
                            </ul>
                            <p>Share your thoughts with your instructor!</p>
                        </div>` :
                        reminderType === 'yearly' ?
                        `<div class="practice-tips">
                            <h4>🎉 Yearly Milestone:</h4>
                            <p>Congratulations on completing another year of music learning!</p>
                            <p>Your dedication to learning ${booking.instrument} is inspiring. We're proud to be part of your musical journey.</p>
                            <p>Here's to another year of beautiful music! 🎶</p>
                        </div>` :
                        ''
                      }
                      
                      <p style="text-align: center; margin-top: 25px;">
                          <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                              View Booking Details
                          </a>
                      </p>
                      
                      <p>Thank you for choosing NdziNote Music School for your musical education!</p>
                  </div>
                  <div class="footer">
                      <p>Happy playing! 🎶<br><strong>The NdziNote Music School Team</strong></p>
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${booking.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  // Send custom email
  static async sendCustomEmail(to, subject, html, attachments = []) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to,
        subject: `${subject} - NdziNote Music School`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .custom-content { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🎵 NdziNote Music School</h1>
                  </div>
                  <div class="content">
                      <div class="custom-content">
                          ${html}
                      </div>
                      <p>Best regards,<br><strong>The NdziNote Music School Team</strong></p>
                  </div>
                  <div class="footer">
                      <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                      <p>This email was sent from NdziNote Music School communication system.</p>
                  </div>
              </div>
          </body>
          </html>
        `,
        attachments
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Custom email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending custom email:', error);
      throw error;
    }
  }

  // Send testimonial confirmation
  static async sendTestimonialConfirmation(testimonial) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: testimonial.email,
        subject: 'Thank You for Your Testimonial - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .testimonial-card { background: white; border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .stars { color: #FFD700; font-size: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              .instrument-icon { font-size: 24px; margin-right: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎵 NdziNote Music School</h1>
                <p>Thank You for Sharing Your Experience!</p>
              </div>
              <div class="content">
                <h2>Dear ${testimonial.name},</h2>
                <p>Thank you for taking the time to share your testimonial with us. We truly appreciate your feedback about your ${testimonial.instrument} learning journey.</p>
                
                <div class="testimonial-card">
                  <h3><span class="instrument-icon">${getInstrumentIcon(testimonial.instrument)}</span> Your Testimonial:</h3>
                  <div class="stars">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                  <p><em>"${testimonial.text}"</em></p>
                  <p><strong>Instrument:</strong> ${testimonial.instrument}</p>
                  <p><strong>Duration:</strong> ${testimonial.duration}</p>
                  <p><strong>Joined:</strong> ${testimonial.joinDate}</p>
                  <p><strong>Status:</strong> ${testimonial.status || 'Pending Review'}</p>
                </div>
                
                <p>Your testimonial has been received and is currently under review. Once approved, it will be displayed on our website to inspire other music enthusiasts.</p>
                
                <p>If you have any questions or would like to update your testimonial, please don't hesitate to contact us.</p>
                
                <p>Keep making beautiful music!<br>
                <strong>The NdziNote Team</strong></p>
                
                <p style="text-align: center; margin-top: 25px;">
                  <a href="${process.env.FRONTEND_URL}/testimonials" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    View All Testimonials
                  </a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                <p>This email was sent to ${testimonial.email}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Testimonial confirmation sent to ${testimonial.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending testimonial confirmation:', error);
      throw error;
    }
  }

  // Send testimonial approval
  static async sendTestimonialApproval(testimonial) {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.EMAIL_FROM,
        to: testimonial.email,
        subject: 'Your Testimonial Has Been Approved! - NdziNote Music School',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .testimonial-preview { background: white; border: 2px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .stars { color: #FFD700; font-size: 20px; }
              .instrument-icon { font-size: 24px; margin-right: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎵 NdziNote Music School</h1>
                <p>Great News About Your Testimonial!</p>
              </div>
              <div class="content">
                <h2>Hello ${testimonial.name},</h2>
                <p>We're excited to let you know that your testimonial has been approved and is now live on our website!</p>
                
                <div class="testimonial-preview">
                  <h3><span class="instrument-icon">${getInstrumentIcon(testimonial.instrument)}</span> Your Approved Testimonial:</h3>
                  <div class="stars">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                  <p><em>"${testimonial.text}"</em></p>
                  <p><strong>- ${testimonial.name}, learning ${testimonial.instrument} for ${testimonial.duration}</strong></p>
                </div>
                
                <p>Your inspiring words about learning ${testimonial.instrument} with us for ${testimonial.duration} will help other aspiring musicians take their first step.</p>
                
                <p>You can view your testimonial on our website:</p>
                <p style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/testimonials" class="button">View Testimonials</a>
                </p>
                
                <p>Thank you for being part of the NdziNote family and for sharing your musical journey with others.</p>
                
                <p>Keep practicing and making beautiful music!<br>
                <strong>The NdziNote Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} NdziNote Music School. All rights reserved.</p>
                <p>This email was sent to ${testimonial.email}</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Testimonial approval sent to ${testimonial.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending testimonial approval:', error);
      throw error;
    }
  }
}

module.exports = EmailService;