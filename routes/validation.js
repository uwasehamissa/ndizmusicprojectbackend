// routes/validation.js
const { body, param, query } = require('express-validator');

const bookingValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('phone')
      .trim()
      .notEmpty().withMessage('Phone is required')
      .matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid phone number is required'),
    
    body('instrument')
      .trim()
      .notEmpty().withMessage('Instrument is required')
      .isIn(['guitar', 'piano', 'violin', 'drums', 'vocals', 'other'])
      .withMessage('Valid instrument is required'),
    
    body('experience')
      .trim()
      .notEmpty().withMessage('Experience level is required')
      .isIn(['beginner', 'intermediate', 'advanced', 'professional'])
      .withMessage('Valid experience level is required'),
    
    body('scheduledDate')
      .notEmpty().withMessage('Scheduled date is required')
      .isISO8601().withMessage('Valid date format is required (YYYY-MM-DD)')
      .custom((value) => {
        const scheduledDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (scheduledDate < today) {
          throw new Error('Scheduled date cannot be in the past');
        }
        return true;
      })
  ],

  updateStatus: [
    param('id')
      .notEmpty().withMessage('Booking ID is required')
      .isMongoId().withMessage('Valid booking ID is required'),
    
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Valid status is required'),
    
    body('adminNotes')
      .optional()
      .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
  ],

  getById: [
    param('id')
      .notEmpty().withMessage('Booking ID is required')
      .isMongoId().withMessage('Valid booking ID is required')
  ],

  getNotifications: [
    query('email')
      .optional()
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    
    query('type')
      .optional()
      .isIn(['booking_created', 'booking_updated', 'booking_reminder', 'admin_alert', 'system'])
      .withMessage('Valid notification type is required'),
    
    query('isRead')
      .optional()
      .isBoolean().withMessage('isRead must be a boolean')
      .toBoolean(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
      .toInt(),
    
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt()
  ],

  markAllRead: [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail()
  ],

  sendTestNotification: [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('type')
      .optional()
      .isIn(['booking_created', 'booking_updated', 'booking_reminder', 'admin_alert', 'system'])
      .withMessage('Valid notification type is required')
  ]
};

module.exports = bookingValidation;