const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/heroBookingController');
const {
  validateBooking,
  validateUpdateStatus,
  validateEmailTest,
  validateQueryParams,
  validateObjectId
} = require('../validations/validation');

// Test email service
router.post('/test-email', validateEmailTest, bookingController.testEmailService);

// Get booking statistics
router.get('/stats', bookingController.getBookingStats);

// Create a new booking
router.post('/', validateBooking, bookingController.createBooking);

// Get all bookings with filters
router.get('/', validateQueryParams, bookingController.getAllBookings);

// Get single booking by ID
router.get('/:id', validateObjectId, bookingController.getBookingById);

// Update booking status
router.patch('/:id/status', validateObjectId, validateUpdateStatus, bookingController.updateBookingStatus);

// Delete booking
router.delete('/:id', validateObjectId, bookingController.deleteBooking);

module.exports = router;