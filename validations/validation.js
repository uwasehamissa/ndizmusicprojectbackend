const Joi = require('joi');

// Validation schemas
const bookingValidationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid phone number'
    }),
  
  instrument: Joi.string()
    .valid('guitar', 'piano', 'violin', 'drums', 'flute', 'saxophone', 'trumpet', 'bass', 'cello', 'clarinet')
    .required()
    .messages({
      'any.only': 'Please select a valid instrument',
      'string.empty': 'Instrument is required'
    }),
  
  experience: Joi.string()
    .valid('beginner', 'intermediate', 'advanced', 'professional')
    .default('beginner')
    .messages({
      'any.only': 'Please select a valid experience level'
    }),
  
  notes: Joi.string()
    .max(500)
    .allow('', null),
  
  lessonDate: Joi.date()
    .greater('now')
    .messages({
      'date.greater': 'Lesson date must be in the future'
    }),
  
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled', 'completed')
    .default('pending')
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled', 'completed')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, confirmed, cancelled, completed',
      'string.empty': 'Status is required'
    })
});

const emailTestSchema = Joi.object({
  testEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address for testing',
      'string.empty': 'Test email is required'
    })
});

const queryParamsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled', 'completed'),
  
  instrument: Joi.string()
    .valid('guitar', 'piano', 'violin', 'drums', 'flute', 'saxophone', 'trumpet', 'bass', 'cello', 'clarinet'),
  
  experience: Joi.string()
    .valid('beginner', 'intermediate', 'advanced', 'professional'),
  
  sort: Joi.string()
    .pattern(/^-?[a-zA-Z_]+$/)
    .default('-bookingDate')
});

// Middleware functions
const validateBooking = (req, res, next) => {
  const { error, value } = bookingValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message.replace(/"/g, '')
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Replace validated data
  req.body = value;
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { error, value } = updateStatusSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message.replace(/"/g, '')
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.body = value;
  next();
};

const validateEmailTest = (req, res, next) => {
  const { error, value } = emailTestSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message.replace(/"/g, '')
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.body = value;
  next();
};

const validateQueryParams = (req, res, next) => {
  const { error, value } = queryParamsSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message.replace(/"/g, '')
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors
    });
  }

  req.query = value;
  next();
};

// ObjectId validation middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  // Check if id is a valid MongoDB ObjectId
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking ID format'
    });
  }
  
  next();
};

module.exports = {
  validateBooking,
  validateUpdateStatus,
  validateEmailTest,
  validateQueryParams,
  validateObjectId
};