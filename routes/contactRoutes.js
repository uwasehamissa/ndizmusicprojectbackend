// const express = require('express');
// const { body, query } = require('express-validator');
// const rateLimit = require('express-rate-limit');
// const { 
//   contactController, 
//   statsController, 
//   emailController 
// } = require('../controllers/contactsController');

// const router = express.Router();

// // Rate limiting
// const contactLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.CONTACT_FORM_RATE_LIMIT) || 5,
//   message: 'Too many contact form submissions from this IP, please try again later.'
// });

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.API_RATE_LIMIT) || 100,
//   message: 'Too many requests from this IP, please try again later.'
// });

// // Contact Form Routes
// router.post(
//   '/contact',
//   contactLimiter,
//   [
//     body('name')
//       .trim()
//       .isLength({ min: 2, max: 100 })
//       .withMessage('Name must be between 2 and 100 characters'),
//     body('email')
//       .trim()
//       .isEmail()
//       .normalizeEmail()
//       .withMessage('Please provide a valid email address'),
//     body('subject')
//       .trim()
//       .isLength({ min: 5, max: 200 })
//       .withMessage('Subject must be between 5 and 200 characters'),
//     body('message')
//       .trim()
//       .isLength({ min: 10, max: 5000 })
//       .withMessage('Message must be between 10 and 5000 characters')
//   ],
//   contactController.submitContactForm
// );

// // Contact Management Routes (Admin)
// router.get(
//   '/contacts',
//   apiLimiter,
//   [
//     query('page').optional().isInt({ min: 1 }),
//     query('limit').optional().isInt({ min: 1, max: 100 }),
//     query('status').optional().isIn(['pending', 'responded', 'archived', 'spam']),
//     query('search').optional().isString().trim()
//   ],
//   contactController.getAllContacts
// );

// router.patch(
//   '/contacts/:id/status',
//   apiLimiter,
//   [
//     body('status')
//       .isIn(['pending', 'responded', 'archived', 'spam'])
//       .withMessage('Invalid status')
//   ],
//   contactController.updateContactStatus
// );

// // Statistics Routes
// router.get(
//   '/stats/dashboard',
//   apiLimiter,
//   statsController.getDashboardStats
// );

// router.get(
//   '/stats/hourly',
//   apiLimiter,
//   statsController.getHourlyStats
// );

// // Email Routes
// router.post(
//   '/email/send',
//   apiLimiter,
//   [
//     body('to').isEmail().withMessage('Invalid recipient email'),
//     body('subject')
//       .trim()
//       .isLength({ min: 5, max: 200 })
//       .withMessage('Subject must be between 5 and 200 characters'),
//     body('message')
//       .trim()
//       .isLength({ min: 10 })
//       .withMessage('Message must be at least 10 characters')
//   ],
//   emailController.sendEmail
// );

// router.get(
//   '/email/stats',
//   apiLimiter,
//   [
//     query('startDate').optional().isISO8601(),
//     query('endDate').optional().isISO8601()
//   ],
//   emailController.getEmailStats
// );

// // Health check route
// router.get('/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     service: 'Email & Statistics API'
//   });
// });

// module.exports = router;













require('dotenv').config();

const express = require('express');
const { body, query } = require('express-validator');
const rateLimit = require('express-rate-limit');

const {
  contactController,
  statsController,
  emailController,
} = require('../controllers/contactsController');

const router = express.Router();

// ==========================
// Rate limiting
// ==========================
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.CONTACT_FORM_RATE_LIMIT) || 5,
  message: 'Too many contact form submissions from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.API_RATE_LIMIT) || 10000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================
// Contact Form Routes
// ==========================
router.post(
  '/contact',
  contactLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().isLength({ min: 5, max: 200 }),
    body('message').trim().isLength({ min: 10, max: 5000 }),
  ],
  contactController.submitContactForm
);

// ==========================
// Contact Management Routes (Admin)
// ==========================
router.get(
  '/contacts',
  apiLimiter,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'responded', 'archived', 'spam']),
    query('search').optional().isString().trim(),
  ],
  contactController.getAllContacts
);
router.get("/email/:email", contactController.getContactsByEmail);


router.patch(
  '/contacts/:id/status',
  apiLimiter,
  [
    body('status')
      .isIn(['pending', 'responded', 'archived', 'spam'])
      .withMessage('Invalid status'),
  ],
  contactController.updateContactStatus
);

// ==========================
// Statistics Routes
// ==========================
router.get(
  '/stats/dashboard',
  apiLimiter,
  statsController.getDashboardStats
);

// ==========================
// Email Routes
// ==========================
router.post(
  '/email/send',
  apiLimiter,
  [
    body('to').isEmail(),
    body('subject').trim().isLength({ min: 5, max: 200 }),
    body('message').trim().isLength({ min: 10 }),
  ],
  emailController.sendEmail
);

// ==========================
// Health Check Route
// ==========================
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Contact & Email API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
