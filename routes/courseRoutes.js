// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// CRUD
router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Search
router.get('/search/query', courseController.searchCourses);

// Statistics
router.get('/stats/overview', courseController.getCourseStatistics);

module.exports = router;
