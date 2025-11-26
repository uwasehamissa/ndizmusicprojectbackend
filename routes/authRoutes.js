const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  updateStatus,
  deleteAccount,
  deleteUser,
  logout,
  testAuth
} = require('../controllers/authController');

// Import middleware
const { protect, admin, verified } = require('../middlewares/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/test', testAuth);

// ========== PROTECTED ROUTES ========== //

router.get('/me',  getMe);
router.put('/profile',  updateProfile);
router.put('/password',  updatePassword);
router.delete('/account',  deleteAccount);
router.post('/logout', logout);
router.get('/test-protected',  testAuth);

// ========== ADMIN ROUTES ========== //

router.get('/',  getAllUsers);
router.get('/:id',  getUserById);
router.patch('/:id/status',  updateStatus);
router.delete('/:id',  deleteUser);
router.get('/test-admin',  testAuth);

module.exports = router;