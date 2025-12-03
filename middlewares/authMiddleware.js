
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Rate limiting for failed attempts
const failedAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Helper: Check if IP is blocked
const isBlocked = (ip) => {
  const attempts = failedAttempts.get(ip);
  if (!attempts) return false;
  
  if (attempts.count >= MAX_ATTEMPTS && (Date.now() - attempts.lastAttempt) < LOCK_TIME) {
    return true;
  }
  return false;
};

// Helper: Record failed attempt
const recordFailedAttempt = (ip) => {
  const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  failedAttempts.set(ip, attempts);
  
  // Clean up old entries
  setTimeout(() => {
    const current = failedAttempts.get(ip);
    if (current && (Date.now() - current.lastAttempt) > LOCK_TIME) {
      failedAttempts.delete(ip);
    }
  }, LOCK_TIME + 60000);
};

// Helper: Reset failed attempts
const resetFailedAttempts = (ip) => {
  failedAttempts.delete(ip);
};

// Extract token from various sources
const extractToken = (req) => {
  let token = null;
  
  // 1. Check Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // 2. Check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  // 3. Check query parameter (for email verification links)
  else if (req.query && req.query.token) {
    token = req.query.token;
  }
  
  return token;
};

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Check if IP is temporarily blocked
    if (isBlocked(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed authentication attempts. Please try again in 15 minutes.',
        error: 'IP temporarily blocked'
      });
    }
    
    // Extract token
    const token = extractToken(req);
    
    // Check if token exists
    if (!token) {
      recordFailedAttempt(clientIP);
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
        error: 'No token'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if token has required data
      if (!decoded.userId) {
        recordFailedAttempt(clientIP);
        return res.status(401).json({
          success: false,
          message: 'Invalid token structure',
          error: 'Invalid token'
        });
      }
      
      // Get user from database
      const user = await User.findById(decoded.userId)
        .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');
      
      // Check if user exists
      if (!user) {
        recordFailedAttempt(clientIP);
        return res.status(401).json({
          success: false,
          message: 'User account no longer exists',
          error: 'User not found'
        });
      }
      
      // Check if user is active
      if (user.status === 'banned' || user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: `Your account is ${user.status}. Please contact support.`,
          error: 'Account disabled'
        });
      }
      
      // Check if user needs to verify email
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email address to access this resource',
          error: 'Email not verified',
          requiresVerification: true
        });
      }
      
      // Reset failed attempts on successful authentication
      resetFailedAttempts(clientIP);
      
      // Attach user to request object
      req.user = {
        id: user._id.toString(),
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        isVerified: user.isVerified,
        role: user.status, // For role-based access
        lastLogin: user.lastLogin
      };
      
      // Update last activity
      user.lastActivity = new Date();
      await user.save().catch(err => {
        console.warn('Failed to update user activity:', err.message);
      });
      
      next();
      
    } catch (jwtError) {
      recordFailedAttempt(clientIP);
      
      // Handle specific JWT errors
      let message = 'Invalid authentication token';
      
      if (jwtError.name === 'TokenExpiredError') {
        message = 'Your session has expired. Please log in again.';
      } else if (jwtError.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again.';
      }
      
      return res.status(401).json({
        success: false,
        message: message,
        error: jwtError.name,
        requiresLogin: true
      });
    }
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    // Don't expose server errors in production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Authentication failed';
    
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: errorMessage
    });
  }
};

// Admin middleware - check if user is admin
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.status === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
      error: 'Insufficient permissions'
    });
  }
};

// Moderator middleware - check if user is moderator or admin
const moderator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (['admin', 'moderator'].includes(req.user.status)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Moderator or Admin privileges required.',
      error: 'Insufficient permissions'
    });
  }
};

// Verified email middleware
const verified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.isVerified) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this resource',
      error: 'Email verification required',
      requiresVerification: true
    });
  }
};

// Role-based access control
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (roles.includes(req.user.status)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`,
        error: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.status
      });
    }
  };
};

// Optional authentication (user not required, but attached if exists)
const optional = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return next(); // No token, continue without user
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId)
        .select('-password -verificationToken -resetPasswordToken -resetPasswordExpire');
      
      if (user && user.isVerified && !['banned', 'suspended'].includes(user.status)) {
        req.user = {
          id: user._id.toString(),
          _id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
          isVerified: user.isVerified
        };
      }
    } catch (jwtError) {
      // Token is invalid, but we don't fail the request
      console.log('Optional auth: Invalid token - continuing without user');
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Rate limiting middleware for specific endpoints
const rateLimitMiddleware = (windowMs = 900000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    const entries = requests.get(ip) || [];
    const validEntries = entries.filter(time => time > windowStart);
    
    if (validEntries.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((validEntries[0] + windowMs - now) / 1000)
      });
    }
    
    validEntries.push(now);
    requests.set(ip, validEntries);
    next();
  };
};

// CSRF protection (for forms)
const csrfProtection = (req, res, next) => {
  // Only check for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!csrfToken) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token missing',
        error: 'Security violation'
      });
    }
    
    // In a real app, you'd verify this against a session token
    // This is a simplified version
    next();
  } else {
    next();
  }
};

module.exports = {
  protect,
  admin,
  moderator,
  verified,
  requireRole,
  optional,
  rateLimitMiddleware,
  csrfProtection,
  extractToken
};