// const express = require('express');
// const router = express.Router();
// const {
//   register,
//   login,
//   getMe,
//   getAllUsers,
//   getUserById,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
//   updateProfile,
//   updatePassword,
//   updateStatus,
//   deleteAccount,
//   deleteUser,
//   logout,
//   testAuth
// } = require('../controllers/authController');

// // Import middleware
// // const { verified } = require('../middlewares/authMiddleware');


// router.post('/register', register);
// router.post('/login', login);
// router.get('/verify-email/:token', verifyEmail);
// router.post('/forgot-password', forgotPassword);
// router.put('/reset-password/:token', resetPassword);
// router.get('/test', testAuth);

// // ========== PROTECTED ROUTES ========== //

// router.get('/me',  getMe);
// router.put('/profile',  updateProfile);
// router.put('/password',  updatePassword);
// router.delete('/account',  deleteAccount);
// router.post('/logout', logout);
// router.get('/test-protected',  testAuth);

// // ========== ADMIN ROUTES ========== //

// router.get('/',  getAllUsers);
// router.get('/:id',  getUserById);
// router.patch('/:id/status',  updateStatus);
// router.delete('/:id',  deleteUser);
// router.get('/test-admin',  testAuth);

// module.exports = router;












const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { 
  protect, 
  requireRole,
  optional,
  rateLimitMiddleware,
} = require("../middlewares/authMiddleware");

// Apply rate limiting to auth routes
router.use(rateLimitMiddleware(900000, 100)); // 15 minutes, 100 requests

// Public routes (no authentication required)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);
router.get("/health", authController.healthCheck);

// Protected routes (authentication required)
router.use(protect); // All routes below require authentication

router.get("/profile", authController.getMe);
router.put("/profile", authController.updateProfile);
router.put("/password", authController.updatePassword);
router.delete("/account", authController.deleteAccount);
router.post("/logout", authController.logout);

// Admin-only routes
router.get("/", authController.getAllUsers);
router.get("/:id", requireRole('admin', 'moderator'), authController.getUserById);
router.put("/:id/status", requireRole('admin'), authController.updateStatus);
router.delete("/:id", requireRole('admin'), authController.deleteUser);

// Optional auth route (public but enhanced if logged in)
router.get("/public/data", optional, authController.getPublicData);

// Test routes
router.get("/test/auth", protect, authController.testAuth);
router.get("/test/admin", protect, requireRole('admin'), authController.testAdmin);

module.exports = router;