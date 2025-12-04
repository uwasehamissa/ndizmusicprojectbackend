const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/testimonialController');

// ======================================================
//                   CREATE ROUTES
// ======================================================
router.post('/', TestimonialController.createTestimonial);
router.post('/batch', TestimonialController.createBatchTestimonials);


// ======================================================
//                   READ ROUTES
// ======================================================
router.get('/', TestimonialController.getAllTestimonials);
router.get('/health', TestimonialController.healthCheck);


// Specific search filters
router.get('/email/:email', TestimonialController.getTestimonialsByEmail);
router.get('/instrument/:instrument', TestimonialController.getTestimonialsByInstrument);

// ======================================================
//                   STATISTICS ROUTES
// ======================================================
router.get('/stats/overview', TestimonialController.getStatistics);
router.get('/stats/dashboard', TestimonialController.getDashboardStats);
router.get('/stats/trends', TestimonialController.getTrends);

// ======================================================
//                   UPDATE ROUTES
// ======================================================
router.put('/:id', TestimonialController.updateTestimonial);
router.patch('/:id', TestimonialController.patchTestimonial);

router.patch('/:id/approve', TestimonialController.approveTestimonial);
router.patch('/:id/reject', TestimonialController.rejectTestimonial);
router.patch('/:id/toggle-featured', TestimonialController.toggleFeatured);

// ======================================================
//                   DELETE ROUTES
// ======================================================
router.delete('/:id', TestimonialController.deleteTestimonial);
router.delete('/batch', TestimonialController.deleteBatchTestimonials);

// ======================================================
//            MUST BE LAST → GET BY ID ROUTE
// ======================================================
router.get('/:id', TestimonialController.getTestimonialById);

module.exports = router;
