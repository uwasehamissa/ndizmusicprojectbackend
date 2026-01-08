require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const courseRoutes = require('./routes/courseRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const heroRoutes = require('./routes/heroRoutes');
const { testEmailConfig } = require("./emails/sendEmail");

const app = express();

// Connect to MongoDB with timeout handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    console.log("🔄 Connecting to MongoDB...");

    const options = {
      serverSelectionTimeoutMS: 1000000, // 10 seconds timeout
      socketTimeoutMS: 4500000,
      connectTimeoutMS: 1000000,
      maxPoolSize: 10,
    };

    await mongoose.connect(mongoURI, options);
    console.log("✅ MongoDB Connected");

    // Set connection event handlers
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connection established");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);

    // More detailed error messages
    if (error.name === "MongoServerSelectionError") {
      console.error("🔍 Please check:");
      console.error(
        "1. Is MongoDB running? (run 'mongod' or 'brew services start mongodb-community')"
      );
      console.error(
        "2. Is the MongoDB service started? (check with 'brew services list')"
      );
      console.error("3. Connection string: " + process.env.MONGODB_URI);
    }

    // Retry connection after 5 seconds
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
    return false;
  }
};

// Test email configuration on startup
const testEmailOnStartup = async () => {
  try {
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASS) {
      await testEmailConfig();
      console.log("✅ Email configuration test passed");
    } else {
      console.warn(
        "⚠️ Email configuration not set. Some features may not work."
      );
    }
  } catch (error) {
    console.warn("⚠️ Email configuration test failed:", error.message);
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", limiter);

// Routes
app.use("/api/users", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/testimonials", testimonialRoutes);
app.use('/api/courses', courseRoutes);
app.use('/newsletter', subscriptionRoutes);
app.use('/herobooking', heroRoutes);
// Health check endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    message: "Server is running",
    database: {
      status: states[dbState] || "unknown",
      readyState: dbState,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
    },
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Authentication API is running",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/users",
      register: "POST /api/users/register",
      login: "POST /api/users/login",
      profile: "GET /api/users/profile",
      getAllUsers: "GET /api/users",
      forgotPassword: "POST /api/users/forgot-password",
      resetPassword: "POST /api/users/reset-password/:token",
      verifyEmail: "GET /api/users/verify-email/:token",
      health: "GET /health",
    },
    documentation: {
      baseUrl: "http://localhost:" + (process.env.PORT || 5000),
      routes: "All routes are prefixed with /api/users",
      authentication: "JWT Bearer token required for protected routes",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  // Handle timeout errors
  if (err.message.includes("timeout") || err.code === "ETIMEDOUT") {
    return res.status(504).json({
      success: false,
      message: "Connection timeout",
      error: "Database connection timeout. Please try again.",
    });
  }

  // Handle database connection errors
  if (
    err.name === "MongoNetworkError" ||
    err.name === "MongoServerSelectionError"
  ) {
    return res.status(503).json({
      success: false,
      message: "Database connection error",
      error: "Unable to connect to database. Please try again later.",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /",
      "GET /health",
      "POST /api/users/register",
      "POST /api/users/login",
      "GET /api/users/profile",
      "GET /api/users",
    ],
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await testEmailOnStartup();

    app.listen(PORT, () => {
      console.log(`
      ========================================
      🚀 Server running on port ${PORT}
      🌐 Environment: ${process.env.NODE_ENV || "development"}
      🔗 Local: http://localhost:${PORT}
      🔗 Health check: http://localhost:${PORT}/health
      📅 Started at: ${new Date().toLocaleString()}
      ========================================
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 SIGTERM received. Closing MongoDB connection...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

startServer();

module.exports = app; // For testing
