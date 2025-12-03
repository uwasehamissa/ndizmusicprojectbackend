// utils/utils.js
const cron = require('node-cron');
const moment = require('moment');
const winston = require('winston');

class Utils {
  // ========== LOGGER ==========
  static logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'booking-system' },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });

  // ========== CRON JOBS ==========
  static initCronJobs() {
    Utils.logger.info('Initializing cron jobs...');

    // Daily reminders at 9 AM
    cron.schedule('0 9 * * *', async () => {
      await Utils.sendDailyReminders();
    });

    // Weekly reminders every Monday at 10 AM
    cron.schedule('0 10 * * 1', async () => {
      await Utils.sendWeeklyReminders();
    });

    // Monthly reminders on 1st of month at 11 AM
    cron.schedule('0 11 1 * *', async () => {
      await Utils.sendMonthlyReminders();
    });

    // Yearly reminders on Jan 1st at 12 PM
    cron.schedule('0 12 1 1 *', async () => {
      await Utils.sendYearlyReminders();
    });

    // Clean old notifications every Sunday at 2 AM
    cron.schedule('0 2 * * 0', async () => {
      await Utils.cleanOldNotifications();
    });

    // Status check every hour
    cron.schedule('0 * * * *', async () => {
      await Utils.systemStatusCheck();
    });

    Utils.logger.info('Cron jobs initialized successfully');
  }

  static async sendDailyReminders() {
    try {
      const Booking = require('../models/Booking');
      const Notification = require('../models/Notification');
      const EmailService = require('../services/emailService');

      const tomorrow = moment().add(1, 'day').startOf('day');
      const dayAfterTomorrow = moment().add(2, 'day').startOf('day');

      const bookings = await Booking.find({
        scheduledDate: {
          $gte: tomorrow.toDate(),
          $lt: dayAfterTomorrow.toDate()
        },
        status: 'confirmed'
      });

      for (const booking of bookings) {
        await EmailService.sendReminder(booking, 'daily');
        
        await Notification.create({
          email: booking.email,
          type: 'booking_reminder',
          title: 'Daily Reminder',
          message: `You have a ${booking.instrument} lesson tomorrow at ${moment(booking.scheduledDate).format('h:mm A')}`,
          bookingId: booking._id,
          sentVia: ['email']
        });
      }

      Utils.logger.info(`Sent ${bookings.length} daily reminders`);
    } catch (error) {
      Utils.logger.error('Error sending daily reminders:', error);
    }
  }

  static async sendWeeklyReminders() {
    try {
      const Booking = require('../models/Booking');
      const EmailService = require('../services/emailService');

      const startOfWeek = moment().add(1, 'week').startOf('isoWeek');
      const endOfWeek = moment().add(1, 'week').endOf('isoWeek');

      const bookings = await Booking.find({
        scheduledDate: {
          $gte: startOfWeek.toDate(),
          $lte: endOfWeek.toDate()
        },
        status: 'confirmed'
      });

      for (const booking of bookings) {
        await EmailService.sendReminder(booking, 'weekly');
      }

      Utils.logger.info(`Sent ${bookings.length} weekly reminders`);
    } catch (error) {
      Utils.logger.error('Error sending weekly reminders:', error);
    }
  }

  static async sendMonthlyReminders() {
    try {
      const Booking = require('../models/Booking');
      const EmailService = require('../services/emailService');

      const nextMonth = moment().add(1, 'month').startOf('month');
      const endOfNextMonth = moment().add(1, 'month').endOf('month');

      const bookings = await Booking.find({
        scheduledDate: {
          $gte: nextMonth.toDate(),
          $lte: endOfNextMonth.toDate()
        },
        status: 'confirmed'
      });

      for (const booking of bookings) {
        await EmailService.sendReminder(booking, 'monthly');
      }

      Utils.logger.info(`Sent ${bookings.length} monthly reminders`);
    } catch (error) {
      Utils.logger.error('Error sending monthly reminders:', error);
    }
  }

  static async sendYearlyReminders() {
    try {
      const Booking = require('../models/Booking');
      const EmailService = require('../services/emailService');

      const nextYear = moment().add(1, 'year').startOf('year');
      const endOfNextYear = moment().add(1, 'year').endOf('year');

      const bookings = await Booking.find({
        scheduledDate: {
          $gte: nextYear.toDate(),
          $lte: endOfNextYear.toDate()
        },
        status: 'confirmed'
      });

      for (const booking of bookings) {
        await EmailService.sendReminder(booking, 'yearly');
      }

      Utils.logger.info(`Sent ${bookings.length} yearly reminders`);
    } catch (error) {
      Utils.logger.error('Error sending yearly reminders:', error);
    }
  }

  static async cleanOldNotifications() {
    try {
      const Notification = require('../models/Notification');
      
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true
      });
      
      Utils.logger.info(`Cleaned ${result.deletedCount} old notifications`);
    } catch (error) {
      Utils.logger.error('Error cleaning old notifications:', error);
    }
  }

  static async systemStatusCheck() {
    try {
      const Booking = require('../models/Booking');
      const Notification = require('../models/Notification');
      const mongoose = require('mongoose');

      // Check database connection
      const dbState = mongoose.connection.readyState;
      const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState];

      // Get counts
      const totalBookings = await Booking.countDocuments();
      const pendingBookings = await Booking.countDocuments({ status: 'pending' });
      const unreadNotifications = await Notification.countDocuments({ isRead: false });

      Utils.logger.debug('System status check:', {
        database: dbStatus,
        totalBookings,
        pendingBookings,
        unreadNotifications
      });
    } catch (error) {
      Utils.logger.error('Error in system status check:', error);
    }
  }

  // ========== HELPER FUNCTIONS ==========
  
  static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
  }

  static calculatePagination(total, page, limit) {
    return {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    };
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
  }

  static generateBookingCode() {
    return 'BK-' + moment().format('YYYYMMDD') + '-' + 
      Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  static async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '')
      .trim();
  }
}

module.exports = Utils;