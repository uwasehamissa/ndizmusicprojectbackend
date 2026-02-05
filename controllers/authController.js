// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const {
//   sendVerificationEmail,
//   sendWelcomeEmail,
//   sendLoginNotificationEmail,
//   sendPasswordResetEmail,
//   sendPasswordChangedEmail,
//   sendStatusChangeEmail
// } = require('../emails/sendEmail');

// // Generate JWT Token
// const generateToken = (userId) => {
//   return jwt.sign(
//     { userId: userId.toString() },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRES_IN || '30d',
//       algorithm: 'HS256'
//     }
//   );
// };

// // Get client IP
// const getClientIp = (req) => {
//   const headersToCheck = [
//     'x-client-ip',
//     'x-forwarded-for',
//     'cf-connecting-ip',
//     'fastly-client-ip',
//     'x-real-ip'
//   ];

//   for (const header of headersToCheck) {
//     const value = req.headers[header];
//     if (value) {
//       const ips = value.split(',').map(ip => ip.trim());
//       return ips[0];
//     }
//   }

//   return req.connection.remoteAddress || req.ip || req.socket.remoteAddress || 'unknown';
// };

// // Auth Controllers
// const register = async (req, res) => {
//   const { name, email, password, confirmPassword } = req.body;

//   if (password !== confirmPassword) {
//     return res.status(400).json({ error: 'Passwords do not match' });
//   }

//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     return res.status(400).json({ error: 'User already exists with this email' });
//   }

//   const user = new User({
//     name,
//     email,
//     password,
//     status: 'user'
//   });

//   const savedUser = await user.save();

//   // Send verification email
//   const verificationToken = crypto.randomBytes(32).toString('hex');
//   const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

//   savedUser.verificationToken = verificationTokenHash;
//   savedUser.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   await savedUser.save();

//   sendVerificationEmail(savedUser.email, savedUser.name, verificationToken)
//     .catch(error => console.warn('Verification email failed:', error.message));

//   const userResponse = savedUser.toObject();
//   delete userResponse.password;

//   const token = generateToken(savedUser._id);

//   res.status(201).json({
//     success: true,
//     message: 'User registered successfully. Please check your email for verification.',
//     token,
//     status: savedUser.status,
//     data: userResponse
//   });
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select('+password');

//   if (!user) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   const isPasswordValid = await user.comparePassword(password);

//   if (!isPasswordValid) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   const clientIp = getClientIp(req);

//   user.lastLogin = new Date();
//   user.lastLoginIp = clientIp;
//   await user.save();

//   const token = generateToken(user._id);

//   // Send login notification
//   sendLoginNotificationEmail(user.email, user.name, clientIp, new Date().toLocaleString(), user.status)
//     .catch(error => console.warn('Login notification email failed:', error.message));

//   const userResponse = user.toObject();
//   delete userResponse.password;

//   res.status(200).json({
//     success: true,
//     message: 'Login successful',
//     token,
//     status: user.status,
//     lastLoginIp: clientIp,
//     data: userResponse
//   });
// };

// const logout = async (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// };

// const verifyEmail = async (req, res) => {
//   const { token } = req.params;

//   const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');

//   const user = await User.findOne({
//     verificationToken: verificationTokenHash,
//     verificationTokenExpiry: { $gt: Date.now() }
//   });

//   if (!user) {
//     return res.status(400).json({ error: 'Invalid or expired verification token' });
//   }

//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationTokenExpiry = undefined;
//   user.emailVerifiedAt = new Date();

//   await user.save();

//   // Send welcome email after verification
//   sendWelcomeEmail(user.email, user.name)
//     .catch(error => console.warn('Welcome email failed:', error.message));

//   res.status(200).json({
//     success: true,
//     message: 'Email verified successfully'
//   });
// };

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     // For security, don't reveal if user exists
//     return res.status(200).json({
//       success: true,
//       message: 'If an account exists with this email, you will receive a password reset link'
//     });
//   }

//   const resetToken = crypto.randomBytes(32).toString('hex');
//   const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//   user.resetPasswordToken = resetPasswordToken;
//   user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

//   await user.save();

//   sendPasswordResetEmail(user.email, user.name, resetToken)
//     .catch(error => console.warn('Password reset email failed:', error.message));

//   res.status(200).json({
//     success: true,
//     message: 'Password reset email sent'
//   });
// };

// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password, confirmPassword } = req.body;

//   if (password !== confirmPassword) {
//     return res.status(400).json({ error: 'Passwords do not match' });
//   }

//   const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() }
//   });

//   if (!user) {
//     return res.status(400).json({ error: 'Invalid or expired reset token' });
//   }

//   user.password = password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   user.lastPasswordChange = new Date();

//   await user.save();

//   sendPasswordChangedEmail(user.email, user.name)
//     .catch(error => console.warn('Password changed email failed:', error.message));

//   res.status(200).json({
//     success: true,
//     message: 'Password reset successfully'
//   });
// };

// // User Controllers
// const getMe = async (req, res) => {
//   const user = await User.findById(req.user.id)
//     .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   res.status(200).json({
//     success: true,
//     data: user
//   });
// };

// const getAllUsers = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const filter = {};

//   if (req.query.status) filter.status = req.query.status;
//   if (req.query.isVerified) filter.isVerified = req.query.isVerified === 'true';
//   if (req.query.search) {
//     filter.$or = [
//       { name: { $regex: req.query.search, $options: 'i' } },
//       { email: { $regex: req.query.search, $options: 'i' } }
//     ];
//   }

//   const sort = {};
//   if (req.query.sortBy) {
//     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
//     const allowedSortFields = ['name', 'email', 'createdAt', 'lastLogin', 'status'];

//     if (allowedSortFields.includes(req.query.sortBy)) {
//       sort[req.query.sortBy] = sortOrder;
//     }
//   } else {
//     sort.createdAt = -1;
//   }

//   const [users, total] = await Promise.all([
//     User.find(filter)
//       .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire')
//       .sort(sort)
//       .skip(skip)
//       .limit(limit),
//     User.countDocuments(filter)
//   ]);

//   const totalPages = Math.ceil(total / limit);

//   res.status(200).json({
//     success: true,
//     count: users.length,
//     total,
//     page,
//     totalPages,
//     data: users
//   });
// };

// const getUserById = async (req, res) => {
//   const user = await User.findById(req.params.id)
//     .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   res.status(200).json({
//     success: true,
//     data: user
//   });
// };

// const updateProfile = async (req, res) => {
//   const { name, email } = req.body;
//   const updateData = {};

//   if (name) updateData.name = name;
//   if (email) {
//     const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });

//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }
//     updateData.email = email;
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     updateData,
//     { new: true, runValidators: true }
//   ).select('-password');

//   res.status(200).json({
//     success: true,
//     message: 'Profile updated successfully',
//     data: updatedUser
//   });
// };

// const updatePassword = async (req, res) => {
//   const { currentPassword, newPassword, confirmPassword } = req.body;

//   if (newPassword !== confirmPassword) {
//     return res.status(400).json({ error: 'New passwords do not match' });
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   const isPasswordValid = await user.comparePassword(currentPassword);

//   if (!isPasswordValid) {
//     return res.status(401).json({ error: 'Current password is incorrect' });
//   }

//   user.password = newPassword;
//   user.lastPasswordChange = new Date();
//   await user.save();

//   sendPasswordChangedEmail(user.email, user.name)
//     .catch(error => console.warn('Password changed email failed:', error.message));

//   res.status(200).json({
//     success: true,
//     message: 'Password updated successfully'
//   });
// };

// const updateStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status, reason } = req.body;

//   const allowedStatuses = ['user', 'admin', 'moderator', 'banned', 'suspended'];
//   if (!allowedStatuses.includes(status)) {
//     return res.status(400).json({
//       error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`
//     });
//   }

//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   if (req.user.id === id && (status === 'banned' || status === 'suspended')) {
//     return res.status(400).json({
//       error: 'You cannot ban or suspend yourself'
//     });
//   }

//   user.status = status;

//   if (status === 'suspended') {
//     user.suspensionReason = reason || 'Administrative action';
//     user.suspensionExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
//   } else if (status === 'banned') {
//     user.banReason = reason || 'Administrative action';
//     user.bannedAt = new Date();
//   }

//   const updatedUser = await user.save();

//   sendStatusChangeEmail(user.email, user.name, status, reason)
//     .catch(error => console.warn('Status change email failed:', error.message));

//   res.status(200).json({
//     success: true,
//     message: 'User status updated successfully',
//     data: {
//       id: updatedUser._id,
//       email: updatedUser.email,
//       status: updatedUser.status,
//       updatedAt: updatedUser.updatedAt
//     }
//   });
// };

// const deleteAccount = async (req, res) => {
//   const user = await User.findByIdAndDelete(req.user.id);

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Your account has been deleted successfully'
//   });
// };

// const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   if (id === req.user.id) {
//     return res.status(400).json({
//       error: 'You cannot delete your own account using this route'
//     });
//   }

//   const deletedUser = await User.findByIdAndDelete(id);

//   if (!deletedUser) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   res.status(200).json({
//     success: true,
//     message: 'User deleted successfully'
//   });
// };

// // System Controllers
// const healthCheck = async (req, res) => {
//   try {
//     // Check if database is connected
//     if (User.db.readyState !== 1) {
//       return res.status(500).json({
//         success: false,
//         message: 'Database connection issue',
//         database: { status: 'disconnected', readyState: User.db.readyState }
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Service is healthy',
//       status: 'operational',
//       timestamp: new Date().toISOString(),
//       database: {
//         status: 'connected',
//         readyState: User.db.readyState,
//         name: User.db.name
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Service is unhealthy',
//       error: error.message
//     });
//   }
// };

// const getStatus = async (req, res) => {
//   const uptime = process.uptime();

//   const formatUptime = (seconds) => {
//     const days = Math.floor(seconds / 86400);
//     const hours = Math.floor((seconds % 86400) / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = Math.floor(seconds % 60);

//     const parts = [];
//     if (days > 0) parts.push(`${days}d`);
//     if (hours > 0) parts.push(`${hours}h`);
//     if (minutes > 0) parts.push(`${minutes}m`);
//     if (secs > 0) parts.push(`${secs}s`);

//     return parts.join(' ') || '0s';
//   };

//   const status = {
//     success: true,
//     timestamp: new Date().toISOString(),
//     service: 'User Authentication Service',
//     version: process.env.npm_package_version || '1.0.0',
//     uptime: {
//       seconds: Math.floor(uptime),
//       human: formatUptime(uptime)
//     },
//     database: {
//       connected: User.db.readyState === 1,
//       readyState: User.db.readyState,
//       name: User.db.name
//     },
//     environment: process.env.NODE_ENV || 'development',
//     memory: {
//       used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
//       total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
//     }
//   };

//   res.status(200).json(status);
// };

// const testAuth = async (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Authentication is working!',
//     user: {
//       id: req.user.id,
//       email: req.user.email,
//       status: req.user.status
//     }
//   });
// };

// module.exports = {
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
// };

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendStatusChangeEmail,
} = require("../emails/sendEmail");

/* ===================== UTILS ===================== */

const generateToken = (userId) =>
  jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const getClientIp = (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip;

  if (!ip) return "unknown";

  // Remove IPv6 prefix like ::ffff:
  if (ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }

  // Handle localhost
  if (ip === "::1") {
    ip = "127.0.0.1";
  }

  return ip;
};

/* ===================== AUTH ===================== */

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ error: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ error: "User already exists with this email" });

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      status: "user",
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    sendVerificationEmail(user.email, user.name, verificationToken).catch(
      () => {},
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully. Verify your email.",
      token: generateToken(user._id),
      status: user.status,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select("+password");
//     if (!user || !(await user.comparePassword(password)))
//       return res.status(401).json({ error: "Invalid email or password" });

//     const ip = getClientIp(req);
//     user.lastLogin = new Date();
//     user.lastLoginIp = ip;
//     await user.save({ validateBeforeSave: false });

//     sendLoginNotificationEmail(
//       user.email,
//       user.name,
//       ip,
//       new Date().toLocaleString(),
//       user.status,
//     ).catch(() => {});

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token: generateToken(user._id),
//       status: user.status,
//       data: user,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ip = getClientIp(req);

    user.lastLogin = new Date();
    user.lastLoginIp = ip;

    await user.save({ validateBeforeSave: false });

    sendLoginNotificationEmail(
      user.email,
      user.name,
      ip,
      new Date().toLocaleString(),
      user.status
    ).catch(() => {});

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      status: user.status,
      data: user,
    });

  } catch (err) {
    next(err); // ✅ Forward error to Express error handler
  }
};


// LOGOUT
exports.logout = async (_req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashed,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.isVerified = true;
  user.emailVerifiedAt = new Date();
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  sendWelcomeEmail(user.email, user.name).catch(() => {});

  res.status(200).json({ success: true, message: "Email verified" });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(200).json({
      success: true,
      message: "If account exists, reset email sent",
    });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save();

  sendPasswordResetEmail(user.email, user.name, token).catch(() => {});

  res.status(200).json({ success: true, message: "Password reset email sent" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  const hashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ error: "Invalid or expired reset token" });

  user.password = password;
  user.lastPasswordChange = new Date();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendPasswordChangedEmail(user.email, user.name).catch(() => {});

  res.status(200).json({ success: true, message: "Password reset successful" });
};

/* ===================== USER ===================== */

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ success: true, data: user });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ success: true, data: user });
};

exports.updateProfile = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(currentPassword)))
    return res.status(401).json({ error: "Current password incorrect" });

  user.password = newPassword;
  user.lastPasswordChange = new Date();
  await user.save();

  sendPasswordChangedEmail(user.email, user.name).catch(() => {});

  res.status(200).json({ success: true, message: "Password updated" });
};

exports.updateStatus = async (req, res) => {
  const { status, reason } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  user.status = status;
  if (status === "suspended") {
    user.suspensionReason = reason;
    user.suspensionExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  }
  if (status === "banned") {
    user.banReason = reason;
    user.bannedAt = new Date();
  }

  await user.save();
  sendStatusChangeEmail(user.email, user.name, status, reason).catch(() => {});

  res.status(200).json({ success: true, message: "Status updated" });
};

exports.deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(200).json({ success: true, message: "Account deleted" });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted" });
};

/* ===================== SYSTEM ===================== */

exports.healthCheck = async (_req, res) => {
  res.status(200).json({
    success: true,
    status: "operational",
    timestamp: new Date().toISOString(),
  });
};

exports.getStatus = async (_req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
};

exports.testAuth = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication is working",
    user: req.user,
  });
};
