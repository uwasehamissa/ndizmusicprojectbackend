const Email = require('../models/Subscription');
const nodemailer = require('nodemailer');

class EmailController {
  constructor() {
    // Email transporter setup
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // CRUD: CREATE - Subscribe
  async subscribe(req, res) {
    try {
      const { email } = req.body;

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      const existing = await Email.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Email already subscribed'
        });
      }

      const newEmail = new Email({
        email: email.toLowerCase(),
        status: 'pending'
      });

      await newEmail.save();

      // Send welcome email
      await this.sendWelcomeEmail(email);

      res.status(201).json({
        success: true,
        message: 'Subscription successful. Welcome email sent.',
        data: { email }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // CRUD: READ - Get all emails
  async getAllEmails(req, res) {
    try {
      const { status } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }

      const emails = await Email.find(query).sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: emails.length,
        data: emails
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // CRUD: READ - Get single email
  async getEmail(req, res) {
    try {
      const { email } = req.params;
      
      const emailRecord = await Email.findOne({ email: email.toLowerCase() });
      
      if (!emailRecord) {
        return res.status(404).json({
          success: false,
          message: 'Email not found'
        });
      }

      res.status(200).json({
        success: true,
        data: emailRecord
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // CRUD: UPDATE - Update status
  async updateStatus(req, res) {
    try {
      const { email } = req.params;
      const { status } = req.body;

      if (!['active', 'unsubscribed', 'pending'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const emailRecord = await Email.findOne({ email: email.toLowerCase() });
      
      if (!emailRecord) {
        return res.status(404).json({
          success: false,
          message: 'Email not found'
        });
      }

      emailRecord.status = status;
      await emailRecord.save();

      // Send status update email
      await this.sendStatusUpdateEmail(email, status);

      res.status(200).json({
        success: true,
        message: 'Status updated',
        data: emailRecord
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // CRUD: DELETE - Remove email
  async deleteEmail(req, res) {
    try {
      const { email } = req.params;

      const result = await Email.findOneAndDelete({ email: email.toLowerCase() });
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Email not found'
        });
      }

      // Send goodbye email
      await this.sendGoodbyeEmail(email);

      res.status(200).json({
        success: true,
        message: 'Email deleted successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // Send newsletter to all active emails
  async sendNewsletter(req, res) {
    try {
      const { subject, content } = req.body;

      const activeEmails = await Email.find({ status: 'active' });
      
      if (activeEmails.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No active subscribers found'
        });
      }

      const results = [];
      for (const record of activeEmails) {
        try {
          await this.sendEmail(record.email, subject, content);
          results.push({ email: record.email, status: 'sent' });
        } catch (error) {
          results.push({ email: record.email, status: 'failed', error: error.message });
        }
      }

      res.status(200).json({
        success: true,
        message: `Newsletter sent to ${activeEmails.length} subscribers`,
        results
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  // EMAIL SERVICE METHODS
  async sendWelcomeEmail(to) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Our Newsletter!',
        html: `
          <h2>Welcome!</h2>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>We'll send you updates and offers regularly.</p>
          <br>
          <p><a href="${process.env.BASE_URL}/unsubscribe?email=${to}">Unsubscribe</a></p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send welcome email to ${to}:`, error);
    }
  }

  async sendStatusUpdateEmail(to, status) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: `Subscription Status Update: ${status}`,
        text: `Your subscription status has been updated to: ${status}`
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Status update sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send status update to ${to}:`, error);
    }
  }

  async sendGoodbyeEmail(to) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Sorry to see you go!',
        text: 'You have been unsubscribed from our newsletter. Hope to see you again soon!'
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Goodbye email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send goodbye email to ${to}:`, error);
    }
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}

module.exports = new EmailController();