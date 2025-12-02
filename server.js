// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const authRoutes = require("./routes/authRoutes");


// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// // Routes
// app.use("/users", authRoutes);


// // Error handling middleware


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));









const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with timeout handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI ;
    
    console.log("🔄 Connecting to MongoDB...");
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
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

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    
    // More detailed error messages
    if (error.name === "MongoServerSelectionError") {
      console.error("🔍 Please check:");
      console.error("1. Is MongoDB running? (run 'mongod' or 'brew services start mongodb-community')");
      console.error("2. Is the MongoDB service started? (check with 'brew services list')");
      console.error("3. Connection string: " + (process.env.MONGODB_URI ));
    }
    
    // Retry connection after 5 seconds
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/users", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected", 
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    success: true,
    message: "Server is running",
    database: states[dbState] || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Authentication API is running",
    version: "1.0.0",
    endpoints: {
      register: "POST /users/register",
      login: "POST /users/login",
      profile: "GET /users/profile",
      getAllUsers: "GET /users",
      forgotPassword: "POST /users/forgot-password",
      resetPassword: "POST /users/reset-password/:token",
    }
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
      error: "Database connection timeout. Please try again."
    });
  }
  
  // Handle database connection errors
  if (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError") {
    return res.status(503).json({
      success: false,
      message: "Database connection error",
      error: "Unable to connect to database. Please try again later."
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});