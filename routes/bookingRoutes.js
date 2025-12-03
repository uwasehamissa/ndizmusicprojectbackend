const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validation = require('./validation');

// POST /api - Create new booking
router.post('/', 
  validation.create,
  bookingController.createBooking
);

// GET /api - Get all bookings (with filters)
router.get('/', bookingController.getBookings);

// GET /api/:id - Get single booking
router.get('/:id',
  validation.getById,
  bookingController.getBookingById
);

// PATCH /api/:id/status - Update booking status
router.patch('/:id/status',
  validation.updateStatus,
  bookingController.updateBookingStatus
);

// PATCH /api/:id - Update booking details
router.patch('/:id',
  validation.getById,
  bookingController.updateBooking
);

// DELETE /api/:id - Delete booking
router.delete('/:id',
  validation.getById,
  bookingController.deleteBooking
);

// GET /api/statistics - Get booking statistics
router.get('/statistics', bookingController.getBookingStatistics);

module.exports = router;