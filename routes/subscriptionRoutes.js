const express = require('express');
const router = express.Router();
const emailController = require('../controllers/subscriptionController');

// CRUD Routes
router.post('/', emailController.subscribe); // CREATE
router.get('/', emailController.getAllEmails); // READ all
router.get('/:email', emailController.getEmail); // READ single
router.put('/:email', emailController.updateStatus); // UPDATE
router.delete('/:email', emailController.deleteEmail); // DELETE

// Email Service Routes
router.post('/newsletter', emailController.sendNewsletter);

module.exports = router;