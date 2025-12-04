// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controllers/bookingController');
// const validation = require('./validation');

// // POST /api - Create new booking
// router.post('/', 
//   validation.create,
//   bookingController.createBooking
// );

// // GET /api - Get all bookings (with filters)
// router.get('/', bookingController.getBookings);

// // GET /api/:id - Get single booking
// router.get('/:id',
//   validation.getById,
//   bookingController.getBookingById
// );

// // Put /api/:id/status - Update booking status
// router.put('/:id/status',
//   validation.updateStatus,
//   bookingController.updateBookingStatus
// );

// // Put /api/:id - Update booking details
// router.put('/:id',
//   validation.getById,
//   bookingController.updateBooking
// );

// // DELETE /api/:id - Delete booking
// router.delete('/:id',
//   validation.getById,
//   bookingController.deleteBooking
// );

// // GET /api/statistics - Get booking statistics
// router.get('/statistics', bookingController.getBookingStatistics);

// module.exports = router;








const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validation = require('./validation');

// CREATE BOOKING
router.post(
  '/',
  validation.create,
  bookingController.createBooking
);

// GET ALL BOOKINGS (WITH FILTERS)
router.get('/', bookingController.getBookings);

// GET BOOKING STATISTICS (must be BEFORE :id route)
router.get('/statistics', bookingController.getBookingStatistics);

// GET SINGLE BOOKING
router.get(
  '/:id',
  validation.getById,
  bookingController.getBookingById
);

// UPDATE BOOKING STATUS
router.put(
  '/:id/status',
  validation.updateStatus,
  bookingController.updateBookingStatus
);

// UPDATE BOOKING DETAILS
router.put(
  '/:id',
  validation.getById,
  bookingController.updateBooking
);

// DELETE BOOKING
router.delete(
  '/:id',
  validation.getById,
  bookingController.deleteBooking
);

module.exports = router;
