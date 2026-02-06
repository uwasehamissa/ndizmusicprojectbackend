// const { Contact, Stats } = require('../models/Contact');
// const nodemailer = require('nodemailer');
// const { validationResult } = require('express-validator');
// require('dotenv').config();

// // Email Service Configuration
// class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: process.env.SMTP_PORT || 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     // Verify connection
//     this.transporter.verify((error) => {
//       if (error) {
//         console.error('SMTP Connection Error:', error);
//       } else {
//         console.log('SMTP Server is ready to send emails');
//       }
//     });
//   }

//   async sendContactFormEmail(contactData) {
//     try {
//       const { name, email, subject, message } = contactData;

//       // Email to admin
//       const adminMailOptions = {
//         from: process.env.SMTP_EMAIL,
//         to: process.env.SMTP_EMAIL,
//         subject: `New Contact Form: ${subject}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #333;">New Contact Form Submission</h2>
//             <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
//               <p><strong>Name:</strong> ${name}</p>
//               <p><strong>Email:</strong> ${email}</p>
//               <p><strong>Subject:</strong> ${subject}</p>
//               <p><strong>Message:</strong></p>
//               <p style="background: white; padding: 10px; border-left: 4px solid #007bff;">
//                 ${message}
//               </p>
//             </div>
//             <p style="color: #666; font-size: 12px; margin-top: 20px;">
//               Received at: ${new Date().toLocaleString()}
//             </p>
//           </div>
//         `
//       };

//       // Auto-reply to user
//       const userMailOptions = {
//         from: process.env.SMTP_EMAIL,
//         to: email,
//         subject: `We received your message: ${subject}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #007bff;">Thank you for contacting us!</h2>
//             <p>Dear <strong>${name}</strong>,</p>
//             <p>We have received your message and our team will review it shortly.
//             We typically respond within 24-48 hours.</p>

//             <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
//               <p><strong>Your Message Summary:</strong></p>
//               <p><strong>Subject:</strong> ${subject}</p>
//               <p>${message.substring(0, 200)}...</p>
//             </div>

//             <p>If you have any urgent concerns, please don't hesitate to contact us again.</p>

//             <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

//             <p style="color: #666; font-size: 14px;">
//               Best regards,<br>
//               <strong>The Support Team</strong><br>
//               ${process.env.COMPANY_NAME || 'Our Company'}
//             </p>

//             <p style="color: #999; font-size: 12px; margin-top: 30px;">
//               This is an automated response. Please do not reply to this email.
//             </p>
//           </div>
//         `
//       };

//       // Send emails
//       await this.transporter.sendMail(adminMailOptions);
//       await this.transporter.sendMail(userMailOptions);

//       // Update statistics
//       const stats = await Stats.getTodayStats();
//       await stats.incrementEmailsSent();

//       return { success: true, message: 'Emails sent successfully' };

//     } catch (error) {
//       console.error('Email sending error:', error);

//       // Update failure statistics
//       const stats = await Stats.getTodayStats();
//       stats.emailsFailed += 1;
//       await stats.save();

//       throw new Error(`Failed to send email: ${error.message}`);
//     }
//   }

//   async sendCustomEmail(to, subject, htmlContent) {
//     try {
//       const mailOptions = {
//         from: process.env.EMAIL_FROM || process.env.SMTP_EMAIL,
//         to: to,
//         subject: subject,
//         html: htmlContent
//       };

//       await this.transporter.sendMail(mailOptions);

//       // Update statistics
//       const stats = await Stats.getTodayStats();
//       await stats.incrementEmailsSent();

//       return { success: true, message: 'Email sent successfully' };
//     } catch (error) {
//       console.error('Custom email error:', error);
//       throw error;
//     }
//   }
// }

// // Initialize Email Service
// const emailService = new EmailService();

// // Contact Form Controller
// const contactController = {
//   // Submit contact form
//   async submitContactForm(req, res) {
//     try {
//       // Validation
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           success: false,
//           errors: errors.array()
//         });
//       }

//       const { name, email, subject, message } = req.body;

//       // Create contact record
//       const contact = new Contact({
//         name,
//         email,
//         subject,
//         message,
//         ipAddress: req.ip,
//         userAgent: req.headers['user-agent'],
//         metadata: {
//           source: 'contact_form',
//           browser: req.headers['user-agent']?.split(' ')[0] || 'unknown'
//         }
//       });

//       await contact.save();

//       // Update statistics
//       const stats = await Stats.getTodayStats();
//       await stats.incrementContacts('pending');

//       // Send emails
//       await emailService.sendContactFormEmail({ name, email, subject, message });

//       // Update contact as responded
//       contact.responseSent = true;
//       contact.status = 'responded';
//       await contact.save();

//       res.status(201).json({
//         success: true,
//         message: 'Contact form submitted successfully. Check your email for confirmation.',
//         data: {
//           id: contact._id,
//           name: contact.name,
//           email: contact.email,
//           subject: contact.subject,
//           submittedAt: contact.createdAt
//         }
//       });

//     } catch (error) {
//       console.error('Contact form error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to submit contact form',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   },

//   // Get all contacts (admin)
//   async getAllContacts(req, res) {
//     try {
//       const { page = 1, limit = 10, status, search } = req.query;

//       const query = {};
//       if (status) query.status = status;
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } },
//           { subject: { $regex: search, $options: 'i' } }
//         ];
//       }

//       const contacts = await Contact.find(query)
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit))
//         .select('-__v');

//       const total = await Contact.countDocuments(query);

//       res.json({
//         success: true,
//         data: contacts,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch contacts'
//       });
//     }
//   },

//   // Update contact status (admin)
//   async updateContactStatus(req, res) {
//     try {
//       const { id } = req.params;
//       const { status } = req.body;

//       const contact = await Contact.findById(id);
//       if (!contact) {
//         return res.status(404).json({
//           success: false,
//           message: 'Contact not found'
//         });
//       }

//       contact.status = status;
//       await contact.save();

//       // Update statistics if needed
//       if (status === 'responded' && !contact.responseSent) {
//         await emailService.sendCustomEmail(
//           contact.email,
//           'Update on your inquiry',
//           `<p>Dear ${contact.name},</p>
//            <p>We have an update regarding your inquiry: "${contact.subject}"</p>
//            <p>Please check our response in your email or contact us for more details.</p>`
//         );
//         contact.responseSent = true;
//         await contact.save();
//       }

//       res.json({
//         success: true,
//         message: 'Contact status updated successfully',
//         data: contact
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update contact status'
//       });
//     }
//   }
// };

// // Statistics Controller
// const statsController = {
//   // Get dashboard statistics
//   async getDashboardStats(req, res) {
//     try {
//       const todayStats = await Stats.getTodayStats();

//       // Get weekly stats
//       const weekAgo = new Date();
//       weekAgo.setDate(weekAgo.getDate() - 7);

//       const weeklyStats = await Stats.find({
//         date: { $gte: weekAgo }
//       }).sort({ date: 1 });

//       // Get contact statistics
//       const contactStats = await Contact.aggregate([
//         {
//           $group: {
//             _id: '$status',
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       // Get recent contacts
//       const recentContacts = await Contact.find()
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .select('name email subject status createdAt');

//       res.json({
//         success: true,
//         data: {
//           today: todayStats,
//           weekly: weeklyStats,
//           contactsByStatus: contactStats,
//           recentContacts: recentContacts,
//           summary: {
//             totalContacts: await Contact.countDocuments(),
//             pendingContacts: await Contact.countDocuments({ status: 'pending' }),
//             respondedContacts: await Contact.countDocuments({ status: 'responded' })
//           }
//         }
//       });

//     } catch (error) {
//       console.error('Stats error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch statistics'
//       });
//     }
//   },

//   // Get hourly statistics
//   async getHourlyStats(req, res) {
//     try {
//       const stats = await Stats.getTodayStats();

//       // Fill missing hours with zeros
//       const hourlyData = Array.from({ length: 24 }, (_, hour) => {
//         const hourData = stats.hourlyData.find(h => h.hour === hour);
//         return {
//           hour: hour,
//           contacts: hourData ? hourData.contacts : 0,
//           emails: hourData ? hourData.emails : 0
//         };
//       });

//       res.json({
//         success: true,
//         data: hourlyData
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch hourly statistics'
//       });
//     }
//   }
// };

// // Email Controller
// const emailController = {
//   // Send custom email
//   async sendEmail(req, res) {
//     try {
//       const { to, subject, message } = req.body;

//       const result = await emailService.sendCustomEmail(to, subject, message);

//       res.json({
//         success: true,
//         message: 'Email sent successfully',
//         data: result
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to send email',
//         error: error.message
//       });
//     }
//   },

//   // Get email statistics
//   async getEmailStats(req, res) {
//     try {
//       const { startDate, endDate } = req.query;

//       const query = {};
//       if (startDate && endDate) {
//         query.date = {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate)
//         };
//       }

//       const stats = await Stats.find(query).sort({ date: 1 });

//       const emailStats = stats.map(stat => ({
//         date: stat.date,
//         emailsSent: stat.emailsSent,
//         emailsFailed: stat.emailsFailed,
//         successRate: stat.emailsSent > 0
//           ? ((stat.emailsSent - stat.emailsFailed) / stat.emailsSent * 100).toFixed(2)
//           : 0
//       }));

//       res.json({
//         success: true,
//         data: emailStats
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to fetch email statistics'
//       });
//     }
//   }
// };

// module.exports = {
//   contactController,
//   statsController,
//   emailController,
//   emailService
// };

require("dotenv").config();

const { Contact, Stats } = require("../models/Contact");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

// ==========================
// Email Service Configuration
// ==========================
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    this.transporter.verify((error) => {
      if (error) {
        console.error("SMTP Connection Error:", error.message);
      } else {
        console.log("SMTP Server is ready to send emails");
      }
    });
  }

  async sendContactFormEmail(contactData) {
    try {
      const { name, email, subject, message } = contactData;

      const adminMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `New Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>${message}</p>
          </div>
        `,
      };

      const userMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: `We received your message: ${subject}`,
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for contacting us. We will get back to you shortly.</p>
          <p><strong>Your message:</strong></p>
          <p>${message}</p>
        `,
      };

      await this.transporter.sendMail(adminMailOptions);
      await this.transporter.sendMail(userMailOptions);

      const stats = await Stats.getTodayStats();
      await stats.incrementEmailsSent();

      return { success: true };
    } catch (error) {
      console.error("Email sending error:", error.message);

      const stats = await Stats.getTodayStats();
      stats.emailsFailed += 1;
      await stats.save();

      throw error;
    }
  }

  async sendCustomEmail(to, subject, htmlContent) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_EMAIL,
        to,
        subject,
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);

      const stats = await Stats.getTodayStats();
      await stats.incrementEmailsSent();

      return { success: true };
    } catch (error) {
      console.error("Custom email error:", error.message);
      throw error;
    }
  }
}

// Initialize Email Service
const emailService = new EmailService();

// ==========================
// Contact Controller
// ==========================
const contactController = {
  // async submitContactForm(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(400).json({
  //         success: false,
  //         errors: errors.array(),
  //       });
  //     }

  //     const { name, email, subject, message } = req.body;

  //     const contact = new Contact({
  //       name,
  //       email,
  //       subject,
  //       message,
  //       ipAddress: req.ip,
  //       userAgent: req.headers['user-agent'],
  //       status: 'pending',
  //       responseSent: false,
  //     });

  //     await contact.save();

  //     const stats = await Stats.getTodayStats();
  //     await stats.incrementContacts('pending');

  //     await emailService.sendContactFormEmail({
  //       name,
  //       email,
  //       subject,
  //       message,
  //     });

  //     contact.responseSent = true;
  //     contact.status = 'responded';
  //     await contact.save();

  //     res.status(201).json({
  //       success: true,
  //       message: 'Contact form submitted successfully',
  //       data: contact,
  //     });
  //   } catch (error) {
  //     console.error('Contact form error:', error.message);
  //     res.status(500).json({
  //       success: false,
  //       message: 'Failed to submit contact form',
  //     });
  //   }
  // },
  async submitContactForm(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, subject, message } = req.body;

      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "pending",
        responseSent: false,
      });

      // Update stats
      const stats = await Stats.getTodayStats();
      await stats.incrementContacts("pending");

      // Try email separately (DO NOT FAIL REQUEST)
      try {
        await emailService.sendContactFormEmail({
          name,
          email,
          subject,
          message,
        });

        contact.responseSent = true;
        contact.status = "responded";
        await contact.save();

        await stats.incrementEmailsSent();
      } catch (emailError) {
        console.error("Email failed:", emailError.message);
      }

      return res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Contact form DB error:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  // GET /api/contacts/by-email/:email
  async getContactsByEmail(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const contacts = await Contact.find({ email }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts,
      });
    } catch (error) {
      console.error("Get contacts by email error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch contacts",
      });
    }
  },
  // DELETE /api/contacts/:id
async deleteContact(req, res) {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Delete contact error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
}
,
  async getAllContacts(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;

      const query = {};
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { subject: new RegExp(search, "i") },
        ];
      }

      const contacts = await Contact.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      res.json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch contacts",
      });
    }
  },

  // ✅ THIS IS THE MISSING FUNCTION (FIXES YOUR ERROR)
  async updateContactStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      contact.status = status;
      await contact.save();

      res.json({
        success: true,
        message: "Contact status updated successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Update status error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to update contact status",
      });
    }
  },
};

// ==========================
// Stats Controller
// ==========================
const statsController = {
  async getDashboardStats(req, res) {
    try {
      const todayStats = await Stats.getTodayStats();
      res.json({
        success: true,
        data: todayStats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  },
};

// ==========================
// Email Controller
// ==========================
const emailController = {
  async sendEmail(req, res) {
    try {
      const { to, subject, message } = req.body;

      await emailService.sendCustomEmail(to, subject, message);

      res.json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send email",
      });
    }
  },
};

// ==========================
// Exports
// ==========================
module.exports = {
  contactController,
  statsController,
  emailController,
  emailService,
};
