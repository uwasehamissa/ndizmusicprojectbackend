// controllers/errorHandler.js
const Utils = require('../utils/utils');

class ErrorHandler {
  /**
   * Handle 404 errors
   */
  static notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  }

  /**
   * Main error handler
   */
  static errorHandler(err, req, res, next) {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    let stack = process.env.NODE_ENV === 'development' ? err.stack : {};

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      stack = Object.values(err.errors).map(val => val.message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
      stack = Object.keys(err.keyValue).map(key => ({
        field: key,
        message: `${key} already exists`
      }));
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      statusCode = 404;
      message = 'Resource not found';
      stack = `Invalid ${err.path}: ${err.value}`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }

    Utils.logger.error(`Error: ${message}`, {
      statusCode,
      path: req.path,
      method: req.method,
      stack: err.stack
    });

    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack }),
      ...(process.env.NODE_ENV !== 'production' && { path: req.path })
    });
  }

  /**
   * Async error handler wrapper
   */
  static catchAsync(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Custom error class
   */
  static AppError = class extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
    }
  };
}

module.exports = ErrorHandler;