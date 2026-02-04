// const express = require('express');
// const router = express.Router();
// // const { protect, admin } = require('../middleware/auth');
// const {
//   register,
//   login,
//   logout,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
//   getMe,
//   getAllUsers,
//   getUserById,
//   updateProfile,
//   updatePassword,
//   updateStatus,
//   deleteAccount,
//   deleteUser,
//   healthCheck,
//   getStatus,
//   testAuth
// } = require('../controllers/authController');

// // Public routes
// router.post('/register', register);
// router.post('/login', login);
// router.get('/verify-email/:token', verifyEmail);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
// router.get('/health', healthCheck);
// router.get('/status', getStatus);

// // Protected routes

// router.get('/me', getMe);
// router.put('/profile', updateProfile);
// router.put('/password', updatePassword);
// router.delete('/account', deleteAccount);
// router.post('/logout', logout);
// router.get('/test-auth', testAuth);

// // Admin routes

// router.get('/', getAllUsers);
// router.get('/:id', getUserById);
// router.put('/:id/status', updateStatus);
// router.delete('/:id', deleteUser);

// module.exports = router;


















const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  getAllUsers,
  getUserById,
  updateProfile,
  updatePassword,
  updateStatus,
  deleteAccount,
  deleteUser,
  healthCheck,
  getStatus,
  testAuth,
} = require("../controllers/authController");

/* =======================
   PUBLIC ROUTES
======================= */
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/health", healthCheck);
router.get("/status", getStatus);

/* =======================
   PROTECTED ROUTES
======================= */

router.get("/me", getMe);
router.put("/profile", updateProfile);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);
router.post("/logout", logout);
router.get("/test-auth", testAuth);

/* =======================
   ADMIN ROUTES
======================= */

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/status", updateStatus);
router.delete("/:id", deleteUser);

module.exports = router;
