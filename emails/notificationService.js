// const Notification = require('../models/Notification');
// const EmailService = require('../emails/sendEmail');
// const Utils = require('../utils/utils');

// class NotificationService {
//   /**
//    * Create and send notification
//    */
//   async createNotification(data) {
//     try {
//       const notification = new Notification({
//         ...data,
//         createdAt: new Date()
//       });
      
//       await notification.save();
      
//       // Send email if configured
//       if (data.sentVia && data.sentVia.includes('email')) {
//         await this.sendEmailNotification(notification);
//       }
      
//       Utils.logger.info(`Notification created: ${notification._id} for ${notification.email}`);
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error creating notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send email notification
//    */
//   async sendEmailNotification(notification) {
//     try {
//       const mailOptions = {
//         from: `"${process.env.APP_NAME || 'Notification System'}" <${process.env.FROM_EMAIL || "ndizmusic@example.com"}>`,
//         to: notification.email,
//         subject: `🔔 ${notification.title}`,
//         html: `
//           <!DOCTYPE html>
//           <html>
//           <head>
//               <meta charset="UTF-8">
//               <meta name="viewport" content="width=device-width, initial-scale=1.0">
//               <style>
//                   .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
//                   .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
//                   .content { padding: 40px 20px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
//                   .notification-box { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
//                   .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
//                   .button { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; }
//               </style>
//           </head>
//           <body>
//               <div class="container">
//                   <div class="header">
//                       <h1 style="margin: 0; font-size: 24px;">${notification.title}</h1>
//                       <p style="margin: 10px 0 0; opacity: 0.9; font-size: 14px;">${this.getNotificationTypeText(notification.type)}</p>
//                   </div>
//                   <div class="content">
//                       <div class="notification-box">
//                           <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 16px;">${notification.message}</p>
                          
//                           ${notification.bookingId ? `
//                           <p style="text-align: center; margin: 25px 0 0;">
//                               <a href="${process.env.FRONTEND_URL}/bookings/${notification.bookingId}" 
//                                  class="button" style="text-decoration: none;">
//                                   View Booking Details
//                               </a>
//                           </p>
//                           ` : ''}
//                       </div>
                      
//                       <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #e5e7eb;">
//                           <p style="margin: 0; color: #6b7280; font-size: 14px;">
//                               <strong>Notification Type:</strong> ${this.getNotificationTypeText(notification.type)}<br>
//                               <strong>Sent Via:</strong> ${notification.sentVia.join(', ')}<br>
//                               <strong>Time:</strong> ${Utils.formatDate(notification.createdAt, 'MMMM D, YYYY h:mm A')}
//                           </p>
//                       </div>
//                   </div>
//                   <div class="footer">
//                       <p>This is an automated notification from ${process.env.APP_NAME || 'the system'}.</p>
//                       <p style="font-size: 12px; color: #9ca3af;">Please do not reply to this email.</p>
//                   </div>
//               </div>
//           </body>
//           </html>
//         `
//       };

//       await EmailService.transporter.sendMail(mailOptions);
//       Utils.logger.info(`Email notification sent to ${notification.email}`, {
//         notificationId: notification._id,
//         type: notification.type
//       });
//     } catch (error) {
//       Utils.logger.error('Error sending email notification:', error);
//       // Don't throw error for email failures
//     }
//   }

//   /**
//    * Send booking alert to admin
//    */
//   async sendBookingAlertToAdmin(booking) {
//     try {
//       const adminEmail = process.env.SMTP_EMAIL;
      
//       if (!adminEmail) {
//         Utils.logger.warn('SMTP_EMAIL not configured, skipping admin notification');
//         return null;
//       }

//       // Create notification record
//       const notification = await this.createNotification({
//         email: adminEmail,
//         type: 'admin_alert',
//         title: 'New Booking Received',
//         message: `New booking from ${booking.name} for ${booking.instrument}`,
//         bookingId: booking._id,
//         sentVia: ['email', 'dashboard']
//       });

//       // Send detailed email to admin
//       await EmailService.sendBookingNotification(booking, adminEmail);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending admin alert:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send status update to user
//    */
//   async sendStatusUpdateToUser(booking, oldStatus, newStatus) {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email: booking.email,
//         type: 'booking_updated',
//         title: 'Booking Status Updated',
//         message: `Your booking status changed from ${oldStatus} to ${newStatus}`,
//         bookingId: booking._id,
//         sentVia: ['email', 'dashboard']
//       });

//       // Send email to user
//       await EmailService.sendStatusUpdate(booking, oldStatus, newStatus);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending status update:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send verification email
//    */
//   async sendVerificationNotification(email, name, token) {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email,
//         type: 'verification',
//         title: 'Email Verification Required',
//         message: 'Please verify your email address to activate your account',
//         sentVia: ['email']
//       });

//       // Send verification email
//       await EmailService.sendVerificationEmail(email, name, token);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending verification notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send welcome notification
//    */
//   async sendWelcomeNotification(email, name) {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email,
//         type: 'welcome',
//         title: 'Welcome to Our Platform',
//         message: 'Your account has been successfully verified and activated',
//         sentVia: ['email', 'dashboard']
//       });

//       // Send welcome email
//       await EmailService.sendWelcomeEmail(email, name);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending welcome notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send login notification
//    */
//   async sendLoginNotification(email, name, ip, time, status, device = 'Unknown') {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email,
//         type: 'security',
//         title: 'New Login Detected',
//         message: `Login from IP ${ip} at ${time}`,
//         sentVia: ['email']
//       });

//       // Send login notification email
//       await EmailService.sendLoginNotificationEmail(email, name, ip, time, status, device);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending login notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send password reset notification
//    */
//   async sendPasswordResetNotification(email, name, token) {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email,
//         type: 'security',
//         title: 'Password Reset Request',
//         message: 'You have requested to reset your password',
//         sentVia: ['email']
//       });

//       // Send password reset email
//       await EmailService.sendPasswordResetEmail(email, name, token);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending password reset notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send password changed notification
//    */
//   async sendPasswordChangedNotification(email, name, ip = 'Unknown') {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email,
//         type: 'security',
//         title: 'Password Changed',
//         message: 'Your password has been successfully changed',
//         sentVia: ['email']
//       });

//       // Send password changed email
//       await EmailService.sendPasswordChangedEmail(email, name, ip);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending password changed notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send status change notification
//    */
//   async sendAccountStatusNotification(email, name, newStatus, reason = '', adminName = 'System') {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email,
//         type: 'account',
//         title: 'Account Status Updated',
//         message: `Your account status has been changed to ${newStatus}`,
//         sentVia: ['email', 'dashboard']
//       });

//       // Send status change email
//       await EmailService.sendStatusChangeEmail(email, name, newStatus, reason, adminName);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending account status notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send reminder notification
//    */
//   async sendReminderNotification(booking, reminderType, customMessage = null) {
//     try {
//       // Create notification record
//       const notification = await this.createNotification({
//         email: booking.email,
//         type: 'reminder',
//         title: `${reminderType ? reminderType.charAt(0).toUpperCase() + reminderType.slice(1) : ''} Reminder`,
//         message: `Reminder for your ${booking.instrument} lesson`,
//         bookingId: booking._id,
//         sentVia: ['email']
//       });

//       // Send reminder email
//       await EmailService.sendReminder(booking, reminderType, customMessage);
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error sending reminder notification:', error);
//       throw error;
//     }
//   }

//   /**
//    * Send batch notifications
//    */
//   async batchSendNotifications(notifications) {
//     try {
//       const results = [];
//       for (const notification of notifications) {
//         try {
//           const result = await this.createNotification(notification);
//           results.push({ success: true, data: result });
//         } catch (error) {
//           results.push({ success: false, error: error.message });
//         }
//       }
//       return results;
//     } catch (error) {
//       Utils.logger.error('Error in batch notification sending:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get unread notifications
//    */
//   async getUnreadNotifications(email) {
//     try {
//       return await Notification.find({ 
//         email, 
//         isRead: false 
//       }).sort({ createdAt: -1 }).limit(50);
//     } catch (error) {
//       Utils.logger.error('Error getting unread notifications:', error);
//       throw error;
//     }
//   }

//   /**
//    * Mark notification as read
//    */
//   async markAsRead(notificationId) {
//     try {
//       const notification = await Notification.findByIdAndUpdate(
//         notificationId,
//         { isRead: true },
//         { new: true }
//       );
      
//       if (notification) {
//         Utils.logger.info(`Notification marked as read: ${notificationId}`);
//       }
      
//       return notification;
//     } catch (error) {
//       Utils.logger.error('Error marking notification as read:', error);
//       throw error;
//     }
//   }

//   /**
//    * Mark all notifications as read
//    */
//   async markAllAsRead(email) {
//     try {
//       const result = await Notification.updateMany(
//         { email, isRead: false },
//         { isRead: true }
//       );
      
//       Utils.logger.info(`Marked ${result.modifiedCount} notifications as read for ${email}`);
//       return result;
//     } catch (error) {
//       Utils.logger.error('Error marking all notifications as read:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get notification type text
//    */
//   getNotificationTypeText(type) {
//     const types = {
//       'booking_created': 'New Booking',
//       'booking_updated': 'Booking Update',
//       'booking_reminder': 'Booking Reminder',
//       'admin_alert': 'Admin Alert',
//       'system': 'System Notification',
//       'verification': 'Email Verification',
//       'welcome': 'Welcome Message',
//       'security': 'Security Alert',
//       'account': 'Account Update',
//       'reminder': 'Reminder'
//     };
//     return types[type] || type;
//   }
// }

// module.exports = new NotificationService();
// emails/notificationService.js
const EmailService = require('./sendEmail');
const Notification = require('../models/Notification');

class NotificationService {
  static async createNotification({ user, booking, type, title, message }) {
    try {
      const notification = await Notification.create({
        user: user?._id || null,
        email: user?.email || null,
        booking: booking?._id || null,
        type,
        title,
        message
      });

      await this.sendEmailNotification({ user, title, message, booking });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  static async sendEmailNotification({ user, title, message, booking }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: user?.email || process.env.ADMIN_EMAIL,
        subject: title || "Notification",
        html: `
          <h3>${title}</h3>
          <p>${message}</p>
          ${booking ? `<p>Booking ID: ${booking._id}</p>` : ""}
        `
      };

      // 🔥 Works now because transporter is exported
      await EmailService.transporter.sendMail(mailOptions);

    } catch (error) {
      console.error("Error sending email notification:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
