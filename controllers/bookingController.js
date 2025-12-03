const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const EmailService = require('../emails/sendEmail');
const NotificationService = require('../emails/notificationService');
const Utils = require('../utils/utils');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

class BookingController {
  // ========== BOOKING METHODS ==========
  
  /**
   * Create a new booking
   */
  async createBooking(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const bookingData = req.body;
      
      // Create booking
      const booking = new Booking(bookingData);
      await booking.save();

      Utils.logger.info(`New booking created: ${booking._id} for ${booking.email}`);

      // Send notification to admin
      await NotificationService.sendBookingAlertToAdmin(booking);

      // Send confirmation to user
      await EmailService.sendBookingConfirmation(booking);

      // Create notification record
      await NotificationService.createNotification({
        email: booking.email,
        type: 'booking_created',
        title: 'Booking Confirmation',
        message: `Your booking for ${booking.instrument} has been received`,
        bookingId: booking._id,
        sentVia: ['email']
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
        notifications: {
          adminAlert: 'Admin has been notified',
          userConfirmation: 'Confirmation email sent'
        }
      });
    } catch (error) {
      Utils.logger.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating booking',
        error: error.message
      });
    }
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { status, adminNotes } = req.body;

      // Find booking
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const oldStatus = booking.status;
      
      // Update booking
      booking.status = status;
      if (adminNotes) booking.adminNotes = adminNotes;
      await booking.save();

      // Send notification to user
      await NotificationService.sendStatusUpdateToUser(booking, oldStatus, status);

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking,
        notifications: {
          userUpdate: 'Status update notification sent to user'
        }
      });
    } catch (error) {
      Utils.logger.error('Error updating booking status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating booking status',
        error: error.message
      });
    }
  }

  /**
   * Get all bookings with filters
   */
  async getBookings(req, res) {
    try {
      const { status, instrument, experience, startDate, endDate, search, page = 1, limit = 10 } = req.query;
      
      let filter = {};
      let searchFilter = {};

      // Status filter
      if (status) filter.status = status;
      
      // Instrument filter
      if (instrument) filter.instrument = instrument;
      
      // Experience filter
      if (experience) filter.experience = experience;
      
      // Date range filter
      if (startDate && endDate) {
        filter.scheduledDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      // Search filter
      if (search) {
        searchFilter = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        };
      }

      // Combine filters
      const finalFilter = { ...filter, ...searchFilter };

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get bookings with pagination
      const bookings = await Booking.find(finalFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const total = await Booking.countDocuments(finalFilter);

      res.json({
        success: true,
        data: bookings,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      Utils.logger.error('Error fetching bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching bookings',
        error: error.message
      });
    }
  }

  /**
   * Get single booking by ID
   */
  async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error) {
      Utils.logger.error('Error fetching booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  }

  /**
   * Update booking details
   */
  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const booking = await Booking.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      });
    } catch (error) {
      Utils.logger.error('Error updating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating booking',
        error: error.message
      });
    }
  }

  /**
   * Delete booking
   */
  async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findByIdAndDelete(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Create notification for admin
      await NotificationService.createNotification({
        email: process.env.ADMIN_EMAIL,
        type: 'system',
        title: 'Booking Deleted',
        message: `Booking ${id} has been deleted`,
        bookingId: id,
        sentVia: ['dashboard']
      });

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      Utils.logger.error('Error deleting booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting booking',
        error: error.message
      });
    }
  }

  /**
   * Get booking statistics
   */
  async getBookingStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      let filter = {};

      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const stats = await Booking.aggregate([
        { $match: filter },
        {
          $facet: {
            totalBookings: [{ $count: "count" }],
            bookingsByStatus: [
              { $group: { _id: "$status", count: { $count: {} } } }
            ],
            bookingsByInstrument: [
              { $group: { _id: "$instrument", count: { $count: {} } } }
            ],
            bookingsByExperience: [
              { $group: { _id: "$experience", count: { $count: {} } } }
            ],
            bookingsByDate: [
              {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  count: { $count: {} }
                }
              },
              { $sort: { _id: -1 } },
              { $limit: 30 }
            ]
          }
        }
      ]);

      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      Utils.logger.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }

  // ========== NOTIFICATION METHODS ==========

  /**
   * Get notifications
   */
  async getNotifications(req, res) {
    try {
      const { email, type, isRead, limit = 20, page = 1 } = req.query;
      let filter = {};

      if (email) filter.email = email;
      if (type) filter.type = type;
      if (isRead !== undefined) filter.isRead = isRead === 'true';

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const notifications = await Notification.find(filter)
        .populate('bookingId', 'name instrument scheduledDate status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Notification.countDocuments(filter);

      res.json({
        success: true,
        data: notifications,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      Utils.logger.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications',
        error: error.message
      });
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(req, res) {
    try {
      const { email } = req.query;
      let filter = { isRead: false };

      if (email) filter.email = email;

      const count = await Notification.countDocuments(filter);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      Utils.logger.error('Error fetching unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching unread count',
        error: error.message
      });
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      Utils.logger.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking notification as read',
        error: error.message
      });
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(req, res) {
    try {
      const { email } = req.body;

      const result = await Notification.updateMany(
        { email, isRead: false },
        { isRead: true }
      );

      res.json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`
      });
    } catch (error) {
      Utils.logger.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking all notifications as read',
        error: error.message
      });
    }
  }

  /**
   * Send test notification
   */
  async sendTestNotification(req, res) {
    try {
      const { email, type = 'system' } = req.body;

      const notification = await NotificationService.createNotification({
        email,
        type,
        title: 'Test Notification',
        message: 'This is a test notification sent from the system',
        sentVia: ['email', 'dashboard']
      });

      res.json({
        success: true,
        message: 'Test notification sent successfully',
        data: notification
      });
    } catch (error) {
      Utils.logger.error('Error sending test notification:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending test notification',
        error: error.message
      });
    }
  }

  /**
   * Send custom reminder
   */
  async sendCustomReminder(req, res) {
    try {
      const { bookingId, reminderType, customMessage } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await EmailService.sendReminder(booking, reminderType, customMessage);

      res.json({
        success: true,
        message: `Reminder sent to ${booking.email}`
      });
    } catch (error) {
      Utils.logger.error('Error sending custom reminder:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending custom reminder',
        error: error.message
      });
    }
  }
}

module.exports = new BookingController();