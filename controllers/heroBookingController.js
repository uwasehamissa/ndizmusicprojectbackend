const Booking = require('../models/HeroBooking');
const nodemailer = require('nodemailer');

class BookingController {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Create a new booking with email notifications
  async createBooking(req, res) {
    try {
      const { name, email, phone, instrument, experience, lessonDate } = req.body;

      // Create new booking
      const booking = new Booking({
        name,
        email,
        phone,
        instrument,
        experience,
      
        lessonDate: lessonDate ? new Date(lessonDate) : undefined
      });

      // Save to database
      const savedBooking = await booking.save();

      // Send confirmation email to customer
      await this.sendConfirmationEmail(savedBooking);
      
      // Send notification to admin (if configured)
      if (process.env.ADMIN_EMAIL) {
        await this.sendAdminNotification(savedBooking);
      }

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking: savedBooking,
          emails: {
            customer: 'Confirmation email sent',
            admin: process.env.ADMIN_EMAIL ? 'Notification sent' : 'No admin email configured'
          }
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }
  }

  // Get all bookings with filters
  async getAllBookings(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        instrument,
        experience,
        sort = '-bookingDate' 
      } = req.query;

      // Build filter
      const filter = {};
      if (status) filter.status = status;
      if (instrument) filter.instrument = instrument;
      if (experience) filter.experience = experience;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const bookings = await Booking.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const total = await Booking.countDocuments(filter);

      res.json({
        success: true,
        data: bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  }

  // Get single booking by ID
  async getBookingById(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);
      
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
      console.error('Error fetching booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
        error: error.message
      });
    }
  }

  // Update booking status
  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Send status update email
      await this.sendStatusUpdateEmail(booking, status);

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking',
        error: error.message
      });
    }
  }

  // Delete booking
  async deleteBooking(req, res) {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete booking',
        error: error.message
      });
    }
  }

  // Get booking statistics
  async getBookingStats(req, res) {
    try {
      const stats = await Booking.aggregate([
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalPending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            totalConfirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
            totalCancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            totalCompleted: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
          }
        },
        {
          $project: {
            _id: 0,
            totalBookings: 1,
            totalPending: 1,
            totalConfirmed: 1,
            totalCancelled: 1,
            totalCompleted: 1
          }
        }
      ]);

      // Get instrument distribution
      const instrumentStats = await Booking.aggregate([
        {
          $group: {
            _id: "$instrument",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Get experience level distribution
      const experienceStats = await Booking.aggregate([
        {
          $group: {
            _id: "$experience",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      res.json({
        success: true,
        data: {
          ...stats[0] || {},
          instrumentDistribution: instrumentStats,
          experienceDistribution: experienceStats,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }

  // Test email service
  async testEmailService(req, res) {
    try {
      const { testEmail } = req.body;

      const testResult = await this.transporter.verify();
      
      if (testResult && testEmail) {
        // Send test email
        await this.transporter.sendMail({
          from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
          to: testEmail,
          subject: 'Test Email - Booking System',
          text: 'This is a test email from the booking system.',
          html: '<h1>Test Email</h1><p>This is a test email from the booking system.</p>'
        });
      }

      res.json({
        success: true,
        message: 'Email service is working',
        testResult: testResult ? 'SMTP connection verified' : 'Connection failed',
        testEmail: testEmail ? 'Test email sent' : 'No test email provided'
      });
    } catch (error) {
      console.error('Email service test failed:', error);
      res.status(500).json({
        success: false,
        message: 'Email service test failed',
        error: error.message
      });
    }
  }

  // ========== PRIVATE EMAIL METHODS ==========

  async sendConfirmationEmail(booking) {
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking Confirmation - ${process.env.APP_NAME}`,
      html: this.generateConfirmationTemplate(booking)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  async sendAdminNotification(booking) {
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking: ${booking.name} - ${booking.instrument}`,
      html: this.generateAdminNotificationTemplate(booking)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Admin notification sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      throw error;
    }
  }

  async sendStatusUpdateEmail(booking, newStatus) {
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Booking Status Update - ${process.env.APP_NAME}`,
      html: this.generateStatusUpdateTemplate(booking, newStatus)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Status update email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending status update email:', error);
      throw error;
    }
  }

  // Email templates
  generateConfirmationTemplate(booking) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .detail-row { margin: 15px 0; padding: 10px; border-bottom: 1px solid #eee; }
          .status-badge { display: inline-block; padding: 5px 15px; background: #28a745; color: white; border-radius: 20px; font-size: 0.9em; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎵 Booking Confirmed!</h1>
            <p>Thank you for choosing ${process.env.APP_NAME}</p>
          </div>
          <div class="content">
            <p>Dear <strong>${booking.name}</strong>,</p>
            <p>Your ${booking.instrument} lesson has been successfully booked!</p>
            
            <div class="details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row"><strong>Booking ID:</strong> ${booking._id}</div>
              <div class="detail-row"><strong>Instrument:</strong> ${booking.instrument}</div>
              <div class="detail-row"><strong>Experience Level:</strong> ${booking.experience}</div>
              <div class="detail-row"><strong>Status:</strong> <span class="status-badge">${booking.status}</span></div>
              <div class="detail-row"><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              ${booking.lessonDate ? `<div class="detail-row"><strong>Scheduled Lesson:</strong> ${new Date(booking.lessonDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>` : ''}
            </div>
            
            <p>Our team will contact you within 24 hours to confirm your lesson schedule.</p>
            <p>If you have any questions, please reply to this email.</p>
            
            <p>Best regards,<br><strong>The ${process.env.APP_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateAdminNotificationTemplate(booking) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .detail-row { margin: 15px 0; padding: 10px; border-bottom: 1px solid #eee; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 New Booking Alert!</h1>
            <p>${process.env.APP_NAME} - Admin Notification</p>
          </div>
          <div class="content">
            <p>A new booking has been submitted through the system.</p>
            
            <div class="details">
              <h3>👤 Customer Details</h3>
              <div class="detail-row"><strong>Name:</strong> ${booking.name}</div>
              <div class="detail-row"><strong>Email:</strong> ${booking.email}</div>
              <div class="detail-row"><strong>Phone:</strong> ${booking.phone}</div>
              <div class="detail-row"><strong>Instrument:</strong> ${booking.instrument}</div>
              <div class="detail-row"><strong>Experience:</strong> ${booking.experience}</div>
              <div class="detail-row"><strong>Booking ID:</strong> ${booking._id}</div>
              <div class="detail-row"><strong>Submitted:</strong> ${new Date(booking.bookingDate).toLocaleString()}</div>
            </div>
            
            <p>Please contact the customer within 24 hours to schedule their first lesson.</p>
            
            <p>Best regards,<br><strong>${process.env.APP_NAME} System</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated notification from ${process.env.APP_NAME}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateStatusUpdateTemplate(booking, newStatus) {
    const statusColors = {
      confirmed: '#28a745',
      cancelled: '#dc3545',
      completed: '#17a2b8',
      pending: '#ffc107'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColors[newStatus] || '#667eea'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .detail-row { margin: 15px 0; padding: 10px; border-bottom: 1px solid #eee; }
          .status-badge { display: inline-block; padding: 5px 15px; background: ${statusColors[newStatus] || '#667eea'}; color: white; border-radius: 20px; font-size: 0.9em; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Booking Status Updated</h1>
            <p>Your booking status has been changed to: ${newStatus}</p>
          </div>
          <div class="content">
            <p>Dear <strong>${booking.name}</strong>,</p>
            <p>Your booking status has been updated.</p>
            
            <div class="details">
              <h3>Updated Information</h3>
              <div class="detail-row"><strong>Booking ID:</strong> ${booking._id}</div>
              <div class="detail-row"><strong>Instrument:</strong> ${booking.instrument}</div>
              <div class="detail-row"><strong>New Status:</strong> <span class="status-badge">${newStatus}</span></div>
              <div class="detail-row"><strong>Update Time:</strong> ${new Date().toLocaleString()}</div>
            </div>
            
            ${newStatus === 'confirmed' ? '<p>Your lesson has been confirmed! Please prepare for your scheduled session.</p>' : ''}
            ${newStatus === 'cancelled' ? '<p>Your booking has been cancelled. If this was a mistake, please contact us immediately.</p>' : ''}
            ${newStatus === 'completed' ? '<p>Your lesson has been marked as completed. Thank you for choosing us!</p>' : ''}
            
            <p>If you have any questions, please don\'t hesitate to contact us.</p>
            
            <p>Best regards,<br><strong>The ${process.env.APP_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new BookingController();