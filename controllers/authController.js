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
const dbConnection = require('../utils/dbConnection');
const emailService = require('../utils/emailService');
const {
  AppError,
  DatabaseError,
  TimeoutError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  handleAsync
} = require('../utils/errorHandler');
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendStatusChangeEmail
} = require('../emails/sendEmail');

// Database query with timeout
const queryWithTimeout = async (query, timeoutMs = 1000000) => {
  try {
    const result = await Promise.race([
      query,
      new Promise((_, reject) => 
        setTimeout(() => reject(new TimeoutError(`Database query timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
    return result;
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw error;
    }
    throw new DatabaseError(`Database operation failed: ${error.message}`);
  }
};

// Generate JWT Token
const generateToken = (userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    return jwt.sign(
      { userId: userId.toString() },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
        algorithm: 'HS256'
      }
    );
  } catch (error) {
    throw new AuthenticationError('Failed to generate authentication token');
  }
};

// CREATE - Register new user
const register = handleAsync(async (req, res, next) => {
  // Check database connection
  await dbConnection.checkConnection();
  
  const { name, email, password, confirmPassword } = req.body;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    throw new ValidationError('All fields are required');
  }

  if (password !== confirmPassword) {
    throw new ValidationError('Passwords do not match');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Password strength validation
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    throw new ValidationError('User already exists with this email');
  }

  // Create user
  const user = new User({ 
    name, 
    email, 
    password, 
    status: 'user'
  });

  const savedUser = await user.save();
  
  // Send welcome email (non-blocking)
  emailService.sendWithRetry(
    sendWelcomeEmail,
    savedUser.email,
    savedUser.name
  ).catch(error => {
    console.warn('Welcome email failed:', error.message);
  });

  // Prepare response
  const userResponse = savedUser.toObject();
  delete userResponse.password;

  // Generate token
  const token = generateToken({
    userId: savedUser._id,
    status: savedUser.status
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    token,
    status: savedUser.status,
    data: userResponse
  });
});

// READ - Login user
const login = handleAsync(async (req, res, next) => {
  // Check database connection
  await dbConnection.checkConnection();
  
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Get actual IP address with proper fallbacks
  const getClientIp = (req) => {
    // Check headers in order of reliability
    const headersToCheck = [
      'x-client-ip',           // Custom header
      'x-forwarded-for',       // Load balancers/proxies
      'cf-connecting-ip',      // Cloudflare
      'fastly-client-ip',      // Fastly
      'x-real-ip',             // Nginx
      'x-cluster-client-ip',   // Rackspace LB, Riverbed Stingray
      'x-forwarded',           // General forward
      'forwarded-for',         // RFC 7239
      'forwarded'              // RFC 7239
    ];
    
    // Check each header
    for (const header of headersToCheck) {
      const value = req.headers[header];
      if (value) {
        // Handle comma-separated lists (x-forwarded-for: client, proxy1, proxy2)
        const ips = value.split(',').map(ip => ip.trim());
        return ips[0]; // Return the first (original client) IP
      }
    }
    
    // Fallback to connection remote address or req.ip
    return req.connection.remoteAddress || req.ip || req.socket.remoteAddress || 'unknown';
  };

  const clientIp = getClientIp(req);
  
  // Update last login info with actual IP
  user.lastLogin = new Date();
  user.lastLoginIp = clientIp;
  await user.save();

  // Generate token
  const token = generateToken({
    userId: user._id,
    status: user.status // 'user' or 'admin'
  });

  // Send login notification with actual IP
  emailService.sendWithRetry(
    sendLoginNotificationEmail,
    user.email,
    user.name,
    clientIp, // Use actual IP
    new Date().toLocaleString(),
    user.status
  ).catch(error => {
    console.warn('Login notification email failed:', error.message);
  });

  // Prepare response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    status: user.status,
    lastLoginIp: clientIp, // Include IP in response for transparency
    data: userResponse
  });
});

// READ - Get current user profile
const getMe = handleAsync(async (req, res, next) => {
  await dbConnection.checkConnection();
  
  const user = await queryWithTimeout(
    User.findById(req.user.id)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
  );
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// READ - Get all users (Admin only)
const getAllUsers = handleAsync(async (req, res, next) => {
  await dbConnection.checkConnection();
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  
  // Apply filters
  if (req.query.status) filter.status = req.query.status;
  if (req.query.isVerified) filter.isVerified = req.query.isVerified === 'true';
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Sorting
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

  // Execute queries with timeout
  const [users, total] = await Promise.all([
    queryWithTimeout(
      User.find(filter)
        .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      15000 // 15 second timeout
    ),
    queryWithTimeout(
      User.countDocuments(filter),
      10000 // 10 second timeout
    )
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
});

// UPDATE - Verify email
const verifyEmail = handleAsync(async (req, res, next) => {
  await dbConnection.checkConnection();
  
  const { token } = req.params;
  
  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  const user = await queryWithTimeout(
    User.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    })
  );

  if (!user) {
    throw new ValidationError('Invalid or expired verification token');
  }

  // Update user
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  user.emailVerifiedAt = new Date();
  
  await queryWithTimeout(user.save());

  // Send welcome email (non-blocking)
  emailService.sendWithRetry(
    sendWelcomeEmail,
    user.email,
    user.name
  ).catch(error => {
    console.warn('Welcome email failed:', error.message);
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// UPDATE - Forgot password
const forgotPassword = handleAsync(async (req, res, next) => {
  await dbConnection.checkConnection();
  
  const { email } = req.body;
  
  if (!email) {
    throw new ValidationError('Email is required');
  }

  const user = await queryWithTimeout(
    User.findOne({ email })
  );

  if (!user) {
    // Don't reveal if user exists for security
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  
  await queryWithTimeout(user.save());

  // Send password reset email (non-blocking)
  emailService.sendWithRetry(
    sendPasswordResetEmail,
    user.email,
    user.name,
    resetToken
  ).catch(error => {
    console.warn('Password reset email failed:', error.message);
  });

  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
});

// UPDATE - Reset password
const resetPassword = handleAsync(async (req, res, next) => {
  await dbConnection.checkConnection();
  
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) {
    throw new ValidationError('Reset token is required');
  }

  if (!password || !confirmPassword) {
    throw new ValidationError('Password and confirmation are required');
  }

  if (password !== confirmPassword) {
    throw new ValidationError('Passwords do not match');
  }

  // Hash the token to compare
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await queryWithTimeout(
    User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })
  );

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  // Update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.lastPasswordChange = new Date();
  
  await queryWithTimeout(user.save());

  // Send password changed email (non-blocking)
  emailService.sendWithRetry(
    sendPasswordChangedEmail,
    user.email,
    user.name
  ).catch(error => {
    console.warn('Password changed email failed:', error.message);
  });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});

// UPDATE - Update user status
const updateStatus = handleAsync(async (req, res, next) => {
  await dbConnection.checkConnection();
  
  const { id } = req.params;
  const { status, reason } = req.body;
  
  // Validate status
  const allowedStatuses = ['user', 'admin', 'moderator', 'banned', 'suspended'];
  if (!allowedStatuses.includes(status)) {
    throw new ValidationError(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
  }

  // Check if user exists
  const user = await queryWithTimeout(
    User.findById(id)
  );
  
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Don't allow self-status change to banned/suspended
  if (req.user.id === id && (status === 'banned' || status === 'suspended')) {
    throw new ValidationError('You cannot ban or suspend yourself');
  }

  // Update status
  user.status = status;
  
  if (status === 'suspended') {
    user.suspensionReason = reason || 'Administrative action';
    user.suspensionExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  } else if (status === 'banned') {
    user.banReason = reason || 'Administrative action';
    user.bannedAt = new Date();
  }
  
  const updatedUser = await queryWithTimeout(user.save());

  // Send status change email (non-blocking)
  emailService.sendWithRetry(
    sendStatusChangeEmail,
    user.email,
    user.name,
    status,
    reason
  ).catch(error => {
    console.warn('Status change email failed:', error.message);
  });

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
});

// Health check endpoint
const healthCheck = handleAsync(async (req, res, next) => {
  try {
    const dbStatus = await dbConnection.checkConnection();
    
    res.status(200).json({
      success: true,
      message: 'Service is healthy',
      status: 'operational',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        ...dbConnection.getConnectionStatus()
      }
    });
  } catch (error) {
    throw new DatabaseError('Service is unhealthy');
  }
});

// Get server status
const getStatus = handleAsync(async (req, res, next) => {
  const dbStats = dbConnection.getConnectionStatus();
  const uptime = process.uptime();
  
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
      connected: dbStats.isConnected,
      readyState: dbStats.readyState,
      host: dbStats.host,
      name: dbStats.name
    },
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    }
  };

  res.status(200).json(status);
});

function formatUptime(seconds) {
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
}

// Export all functions
module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById: handleAsync(async (req, res, next) => {
    await dbConnection.checkConnection();
    
    const user = await queryWithTimeout(
      User.findById(req.params.id)
        .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  }),
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateProfile: handleAsync(async (req, res, next) => {
    await dbConnection.checkConnection();
    
    const { name, email } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) {
      // Check if email exists for another user
      const existingUser = await queryWithTimeout(
        User.findOne({ email, _id: { $ne: req.user.id } })
      );
      
      if (existingUser) {
        throw new ValidationError('Email already exists');
      }
      updateData.email = email;
    }
    
    const updatedUser = await queryWithTimeout(
      User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password')
    );
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  }),
  updatePassword: handleAsync(async (req, res, next) => {
    await dbConnection.checkConnection();
    
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ValidationError('All password fields are required');
    }
    
    if (newPassword !== confirmPassword) {
      throw new ValidationError('New passwords do not match');
    }
    
    // Get user with password
    const user = await queryWithTimeout(
      User.findById(req.user.id).select('+password')
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Verify current password
    const isPasswordValid = await Promise.race([
      user.comparePassword(currentPassword),
      new Promise((_, reject) => 
        setTimeout(() => reject(new TimeoutError('Password verification timeout')), 5000)
      )
    ]);
    
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    user.lastPasswordChange = new Date();
    await queryWithTimeout(user.save());
    
    // Send password changed email
    emailService.sendWithRetry(
      sendPasswordChangedEmail,
      user.email,
      user.name
    ).catch(error => {
      console.warn('Password changed email failed:', error.message);
    });
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  }),
  updateStatus,
  deleteAccount: handleAsync(async (req, res, next) => {
    await dbConnection.checkConnection();
    
    const user = await queryWithTimeout(
      User.findByIdAndDelete(req.user.id)
    );
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'Your account has been deleted successfully'
    });
  }),
  deleteUser: handleAsync(async (req, res, next) => {
    await dbConnection.checkConnection();
    
    const { id } = req.params;
    
    // Prevent self-deletion through admin route
    if (id === req.user.id) {
      throw new ValidationError('You cannot delete your own account using this route');
    }
    
    const deletedUser = await queryWithTimeout(
      User.findByIdAndDelete(id)
    );
    
    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  }),
  logout: handleAsync(async (req, res, next) => {
    // In a stateless JWT system, logout is client-side
    // But we can implement token blacklisting if needed
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }),
  healthCheck,
  getStatus,
  testAuth: handleAsync(async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: 'Authentication is working!',
      user: {
        id: req.user.id,
        email: req.user.email,
        status: req.user.status
      }
    });
  })
};