// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const {
//   sendVerificationEmail,
//   sendWelcomeEmail,
//   sendLoginNotificationEmail,
//   sendPasswordResetEmail,
//   sendPasswordChangedEmail,
//   sendStatusChangeEmail
// } = require('../emails/sendEmail');

// // Generate JWT Token - FIXED
// const generateToken = (userId) => {
//   return jwt.sign(
//     { userId: userId.toString() }, // Ensure userId is string
//     process.env.JWT_SECRET ,
//     { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
//   );
// };

// // CREATE - Register new user
// const register = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Passwords do not match'
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Generate verification token
//     const verificationToken = crypto.randomBytes(32).toString('hex');

//     const user = new User({ 
//       name, 
//       email, 
//       password, 
//       status: 'user',
//       verificationToken
//     });

//     const savedUser = await user.save();
    
//     // Send verification email
//     await sendVerificationEmail(savedUser.email, savedUser.name, verificationToken);

//     // Convert to plain object and remove sensitive data
//     const userResponse = savedUser.toObject();
//     delete userResponse.password;
//     delete userResponse.verificationToken;
//     delete userResponse.resetPasswordToken;
//     delete userResponse.resetPasswordExpire;

//     // Generate token
//     const token = generateToken(savedUser._id);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully. Please check your email for verification.',
//       token,
//       data: userResponse
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error registering user',
//       error: error.message
//     });
//   }
// };

// // READ - Login user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     const token = generateToken(user._id);

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     // Send login notification
//     await sendLoginNotificationEmail(user.email, user.name);

//     // Remove sensitive data
//     const userResponse = user.toObject();
//     delete userResponse.password;
//     delete userResponse.verificationToken;
//     delete userResponse.resetPasswordToken;
//     delete userResponse.resetPasswordExpire;

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       data: userResponse
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error logging in',
//       error: error.message
//     });
//   }
// };

// // READ - Get current user profile
// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user profile',
//       error: error.message
//     });
//   }
// };

// // READ - Get all users (Admin only)
// const getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.isVerified) filter.isVerified = req.query.isVerified === 'true';
//     if (req.query.search) {
//       filter.$or = [
//         { name: { $regex: req.query.search, $options: 'i' } },
//         { email: { $regex: req.query.search, $options: 'i' } }
//       ];
//     }

//     const sort = {};
//     if (req.query.sortBy) {
//       sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
//     } else {
//       sort.createdAt = -1;
//     }

//     const users = await User.find(filter)
//       .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     const total = await User.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       success: true,
//       count: users.length,
//       total,
//       page,
//       totalPages,
//       data: users
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching users',
//       error: error.message
//     });
//   }
// };

// // READ - Get user by ID (Admin only)
// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user',
//       error: error.message
//     });
//   }
// };

// // UPDATE - Verify email
// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid verification token'
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     // Send welcome email
//     await sendWelcomeEmail(user.email, user.name);

//     res.status(200).json({
//       success: true,
//       message: 'Email verified successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error verifying email',
//       error: error.message
//     });
//   }
// };

// // UPDATE - Forgot password
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'No user found with this email'
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
//     user.resetPasswordToken = resetPasswordToken;
//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
//     await user.save();

//     // Send password reset email
//     await sendPasswordResetEmail(user.email, user.name, resetToken);

//     res.status(200).json({
//       success: true,
//       message: 'Password reset email sent'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error processing forgot password',
//       error: error.message
//     });
//   }
// };

// // UPDATE - Reset password
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Passwords do not match'
//       });
//     }

//     const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
//     const user = await User.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     // Send password changed email
//     await sendPasswordChangedEmail(user.email, user.name);

//     res.status(200).json({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error resetting password',
//       error: error.message
//     });
//   }
// };

// // UPDATE - Update current user profile
// const updateProfile = async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     const updateData = {};

//     if (name) updateData.name = name;
//     if (email) updateData.email = email;

//     if (email) {
//       const existingUser = await User.findOne({ 
//         email, 
//         _id: { $ne: req.user.id } 
//       });
//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: 'Email already exists'
//         });
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: updatedUser
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating profile',
//       error: error.message
//     });
//   }
// };

// // UPDATE - Update current user password
// const updatePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'New passwords do not match'
//       });
//     }

//     const user = await User.findById(req.user.id).select('+password');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const isCurrentPasswordValid = await user.comparePassword(currentPassword);
//     if (!isCurrentPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     // Send password changed email
//     await sendPasswordChangedEmail(user.email, user.name);

//     res.status(200).json({
//       success: true,
//       message: 'Password updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating password',
//       error: error.message
//     });
//   }
// };

// const updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { id } = req.params;

//     console.log('Target user ID:', id);
//     console.log('New status:', status);

//     // Update user status
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { status },
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     ).select('-password');

//     // Check if update was successful
//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'User status updated successfully',
//       data: updatedUser
//     });

//   } catch (error) {
//     console.error('Update status error:', error);
    
//     // Handle specific MongoDB errors
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: errors
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Error updating user status',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // DELETE - Delete current user account
// const deleteAccount = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.user.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: 'Your account has been deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting account',
//       error: error.message
//     });
//   }
// };

// // DELETE - Delete user by ID (Admin only)
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if user is authenticated
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not authenticated'
//       });
//     }

//     if (id === req.user.id) {
//       return res.status(400).json({
//         success: false,
//         message: 'You cannot delete your own account using this route'
//       });
//     }
    
//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: 'User deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting user',
//       error: error.message
//     });
//   }
// };

// // READ - Logout user
// const logout = async (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: 'Logged out successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error logging out',
//       error: error.message
//     });
//   }
// };

// // TEST ROUTE - Debug authentication
// const testAuth = async (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: 'Authentication is working!',
//       user: req.user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in test route',
//       error: error.message
//     });
//   }
// };

// module.exports = {
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
// };







// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const {
//   sendVerificationEmail,
//   sendWelcomeEmail,
//   sendLoginNotificationEmail,
//   sendPasswordResetEmail,
//   sendPasswordChangedEmail,
//   sendStatusChangeEmail
// } = require('../emails/sendEmail');

// // =============================
// //  GENERATE JWT TOKEN
// // =============================
// const generateToken = (userId) => {
//   return jwt.sign(
//     { userId: userId.toString() },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
//   );
// };

// // =============================
// //  REGISTER USER
// // =============================
// const register = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Passwords do not match'
//       });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     const verificationToken = crypto.randomBytes(32).toString('hex');

//     const user = new User({
//       name,
//       email,
//       password,
//       status: 'user',
//       verificationToken
//     });

//     const savedUser = await user.save();

//     // Send email in background
//     setTimeout(() => {
//       sendVerificationEmail(savedUser.email, savedUser.name, verificationToken)
//         .catch(() => {});
//     }, 0);

//     const userResponse = savedUser.toObject();
//     delete userResponse.password;
//     delete userResponse.verificationToken;

//     const token = generateToken(savedUser._id);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully. Check your email to verify.',
//       token,
//       data: userResponse
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error registering user',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  LOGIN USER (FIXED TIMEOUT)
// // =============================
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     // Prevent slow MongoDB from hanging forever
//     const user = await User.findOne({ email })
//       .select('+password')
//       .maxTimeMS(4000); // 4 seconds max wait

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     const token = generateToken(user._id);

//     // Save login timestamp without blocking
//     user.lastLogin = new Date();
//     user.save().catch(() => {});

//     // Send email notification (NON-BLOCKING)
//     setTimeout(() => {
//       sendLoginNotificationEmail(user.email, user.name).catch(() => {});
//     }, 0);

//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       data: userResponse
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Error logging in',
//       error: error.message || 'Connection timeout'
//     });
//   }
// };

// // =============================
// //  GET CURRENT USER
// // =============================
// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: user
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching profile',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  GET ALL USERS (ADMIN)
// // =============================
// const getAllUsers = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const filter = {};

//     if (req.query.status) filter.status = req.query.status;
//     if (req.query.search) {
//       filter.$or = [
//         { name: { $regex: req.query.search, $options: 'i' } },
//         { email: { $regex: req.query.search, $options: 'i' } }
//       ];
//     }

//     const sort = {};
//     if (req.query.sortBy) {
//       sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
//     } else {
//       sort.createdAt = -1;
//     }

//     const users = await User.find(filter)
//       .select('-password')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     const total = await User.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       success: true,
//       total,
//       page,
//       totalPages,
//       data: users
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching users',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  GET USER BY ID (ADMIN)
// // =============================
// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select('-password');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  VERIFY EMAIL
// // =============================
// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid verification token'
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     // Send welcome email async
//     setTimeout(() => {
//       sendWelcomeEmail(user.email, user.name).catch(() => {});
//     }, 0);

//     res.status(200).json({
//       success: true,
//       message: 'Email verified successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error verifying email',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  FORGOT PASSWORD
// // =============================
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');

//     user.resetPasswordToken = crypto.createHash('sha256')
//       .update(resetToken)
//       .digest('hex');

//     user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
//     await user.save();

//     // Send email in background
//     setTimeout(() => {
//       sendPasswordResetEmail(user.email, user.name, resetToken)
//         .catch(() => {});
//     }, 0);

//     res.status(200).json({
//       success: true,
//       message: 'Password reset email sent'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error processing forgot password',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  RESET PASSWORD
// // =============================
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Passwords do not match'
//       });
//     }

//     const hashedToken = crypto.createHash('sha256')
//       .update(token)
//       .digest('hex');

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     // notify in background
//     setTimeout(() => {
//       sendPasswordChangedEmail(user.email, user.name).catch(() => {});
//     }, 0);

//     res.status(200).json({
//       success: true,
//       message: 'Password reset successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error resetting password',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  UPDATE PROFILE
// // =============================
// const updateProfile = async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;

//     if (email) {
//       const emailExists = await User.findOne({
//         email,
//         _id: { $ne: req.user.id }
//       });

//       if (emailExists) {
//         return res.status(400).json({
//           success: false,
//           message: 'Email already in use'
//         });
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: updatedUser
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating profile',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  UPDATE PASSWORD
// // =============================
// const updatePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'New passwords do not match'
//       });
//     }

//     const user = await User.findById(req.user.id).select('+password');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const isMatch = await user.comparePassword(currentPassword);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     user.password = newPassword;
//     await user.save();

//     setTimeout(() => {
//       sendPasswordChangedEmail(user.email, user.name).catch(() => {});
//     }, 0);

//     res.status(200).json({
//       success: true,
//       message: 'Password updated successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating password',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  UPDATE USER STATUS (ADMIN)
// // =============================
// const updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { id } = req.params;

//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'User status updated successfully',
//       data: updatedUser
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating user status',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  DELETE OWN ACCOUNT
// // =============================
// const deleteAccount = async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.user.id);
//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Your account has been deleted'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting account',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  DELETE USER BY ID (ADMIN)
// // =============================
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (id === req.user.id) {
//       return res.status(400).json({
//         success: false,
//         message: 'You cannot delete your own account'
//       });
//     }

//     const deleted = await User.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'User deleted successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting user',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  LOGOUT
// // =============================
// const logout = async (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: 'Logged out successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error logging out',
//       error: error.message
//     });
//   }
// };

// // =============================
// //  TEST AUTH ROUTE
// // =============================
// const testAuth = (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Auth working',
//     user: req.user
//   });
// };

// // EXPORT ALL
// module.exports = {
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
// };












const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendStatusChangeEmail
} = require('../emails/sendEmail');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
      algorithm: 'HS256'
    }
  );
};

// Get client IP
const getClientIp = (req) => {
  const headersToCheck = [
    'x-client-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'fastly-client-ip',
    'x-real-ip'
  ];
  
  for (const header of headersToCheck) {
    const value = req.headers[header];
    if (value) {
      const ips = value.split(',').map(ip => ip.trim());
      return ips[0];
    }
  }
  
  return req.connection.remoteAddress || req.ip || req.socket.remoteAddress || 'unknown';
};

// Auth Controllers
const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  const user = new User({ 
    name, 
    email, 
    password, 
    status: 'user'
  });

  const savedUser = await user.save();
  
  // Send verification email
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
  
  savedUser.verificationToken = verificationTokenHash;
  savedUser.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await savedUser.save();
  
  sendVerificationEmail(savedUser.email, savedUser.name, verificationToken)
    .catch(error => console.warn('Verification email failed:', error.message));

  const userResponse = savedUser.toObject();
  delete userResponse.password;

  const token = generateToken(savedUser._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email for verification.',
    token,
    status: savedUser.status,
    data: userResponse
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const clientIp = getClientIp(req);
  
  user.lastLogin = new Date();
  user.lastLoginIp = clientIp;
  await user.save();

  const token = generateToken(user._id);

  // Send login notification
  sendLoginNotificationEmail(user.email, user.name, clientIp, new Date().toLocaleString(), user.status)
    .catch(error => console.warn('Login notification email failed:', error.message));

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    status: user.status,
    lastLoginIp: clientIp,
    data: userResponse
  });
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({ 
    verificationToken: verificationTokenHash,
    verificationTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired verification token' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  user.emailVerifiedAt = new Date();
  
  await user.save();

  // Send welcome email after verification
  sendWelcomeEmail(user.email, user.name)
    .catch(error => console.warn('Welcome email failed:', error.message));

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // For security, don't reveal if user exists
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  
  await user.save();

  sendPasswordResetEmail(user.email, user.name, resetToken)
    .catch(error => console.warn('Password reset email failed:', error.message));

  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.lastPasswordChange = new Date();
  
  await user.save();

  sendPasswordChangedEmail(user.email, user.name)
    .catch(error => console.warn('Password changed email failed:', error.message));

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
};

// User Controllers
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
};

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  
  if (req.query.status) filter.status = req.query.status;
  if (req.query.isVerified) filter.isVerified = req.query.isVerified === 'true';
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const sort = {};
  if (req.query.sortBy) {
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const allowedSortFields = ['name', 'email', 'createdAt', 'lastLogin', 'status'];
    
    if (allowedSortFields.includes(req.query.sortBy)) {
      sort[req.query.sortBy] = sortOrder;
    }
  } else {
    sort.createdAt = -1;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    totalPages,
    data: users
  });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const updateData = {};
  
  if (name) updateData.name = name;
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    updateData.email = email;
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  
  const user = await User.findById(req.user.id).select('+password');
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  
  user.password = newPassword;
  user.lastPasswordChange = new Date();
  await user.save();
  
  sendPasswordChangedEmail(user.email, user.name)
    .catch(error => console.warn('Password changed email failed:', error.message));
  
  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  
  const allowedStatuses = ['user', 'admin', 'moderator', 'banned', 'suspended'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` 
    });
  }

  const user = await User.findById(id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (req.user.id === id && (status === 'banned' || status === 'suspended')) {
    return res.status(400).json({ 
      error: 'You cannot ban or suspend yourself' 
    });
  }

  user.status = status;
  
  if (status === 'suspended') {
    user.suspensionReason = reason || 'Administrative action';
    user.suspensionExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  } else if (status === 'banned') {
    user.banReason = reason || 'Administrative action';
    user.bannedAt = new Date();
  }
  
  const updatedUser = await user.save();

  sendStatusChangeEmail(user.email, user.name, status, reason)
    .catch(error => console.warn('Status change email failed:', error.message));

  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: {
      id: updatedUser._id,
      email: updatedUser.email,
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt
    }
  });
};

const deleteAccount = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(200).json({
    success: true,
    message: 'Your account has been deleted successfully'
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  if (id === req.user.id) {
    return res.status(400).json({ 
      error: 'You cannot delete your own account using this route' 
    });
  }
  
  const deletedUser = await User.findByIdAndDelete(id);
  
  if (!deletedUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
};

// System Controllers
const healthCheck = async (req, res) => {
  try {
    // Check if database is connected
    if (User.db.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database connection issue',
        database: { status: 'disconnected', readyState: User.db.readyState }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Service is healthy',
      status: 'operational',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        readyState: User.db.readyState,
        name: User.db.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service is unhealthy',
      error: error.message
    });
  }
};

const getStatus = async (req, res) => {
  const uptime = process.uptime();
  
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);
    
    return parts.join(' ') || '0s';
  };
  
  const status = {
    success: true,
    timestamp: new Date().toISOString(),
    service: 'User Authentication Service',
    version: process.env.npm_package_version || '1.0.0',
    uptime: {
      seconds: Math.floor(uptime),
      human: formatUptime(uptime)
    },
    database: {
      connected: User.db.readyState === 1,
      readyState: User.db.readyState,
      name: User.db.name
    },
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    }
  };

  res.status(200).json(status);
};

const testAuth = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication is working!',
    user: {
      id: req.user.id,
      email: req.user.email,
      status: req.user.status
    }
  });
};

module.exports = {
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
  testAuth
};