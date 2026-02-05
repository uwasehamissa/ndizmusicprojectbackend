// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const validator = require('validator');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       maxlength: [50, 'Name cannot be more than 50 characters'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       validate: [validator.isEmail, 'Please provide a valid email'],
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: [6, 'Password must be at least 6 characters'],
//       select: false,
//     },
//     status: {
//       type: String,
//       enum: ['user', 'admin'],
//       default: 'user',
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     lastLogin: Date,
//     verificationToken: String,
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;

//   this.password = await bcrypt.hash(this.password, 12);
// });

// // Compare password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   if (!this.password) throw new Error('Password not set for this user');
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Remove sensitive fields when returning user object
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   delete user.verificationToken;
//   delete user.resetPasswordToken;
//   delete user.resetPasswordExpire;
//   return user;
// };

// module.exports = mongoose.model('User', userSchema);















// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const validator = require("validator");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       maxlength: 50,
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       validate: [validator.isEmail, "Invalid email"],
//     },

//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: 6,
//       select: false,
//     },

//     confirmPassword: {
//       type: String,
//       required: [true, "Confirm password is required"],
//       validate: {
//         validator: function (val) {
//           return val === this.password;
//         },
//         message: "Passwords do not match",
//       },
//     },

//     status: {
//       type: String,
//       enum: ["user", "admin", "moderator"],
//       default: "user",
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     emailVerifiedAt: Date,

//     lastLogin: Date,
//     lastLoginIp: String,
//     lastPasswordChange: Date,

//     verificationToken: String,
//     verificationTokenExpiry: Date,

//     resetPasswordToken: String,
//     resetPasswordExpire: Date,

//     suspensionReason: String,
//     suspensionExpiry: Date,

//     banReason: String,
//     bannedAt: Date,
//   },
//   { timestamps: true }
// );

// // 🔐 Hash password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 12);
//   this.confirmPassword = undefined; // never stored

//   next();
// });

// // 🔑 Compare password
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // 🧹 Clean JSON output
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   delete user.verificationToken;
//   delete user.resetPasswordToken;
//   delete user.resetPasswordExpire;
//   return user;
// };

// module.exports = mongoose.model("User", userSchema);



















const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    confirmPassword: {
      type: String,
      required: function () {
        return this.isNew;
      },
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords do not match",
      },
    },

    status: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: Date,

    lastLogin: Date,
    lastLoginIp: String,
    lastPasswordChange: Date,

    verificationToken: String,
    verificationTokenExpiry: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    suspensionReason: String,
    suspensionExpiry: Date,

    banReason: String,
    bannedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
// 🔐 PASSWORD HASHING (NO next(), SAFE)
//

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  this.lastPasswordChange = Date.now() - 1000;
});

//
// 🔑 AUTH METHODS
//

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//
// 🔁 PASSWORD RESET TOKEN
//

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};

//
// 📧 EMAIL VERIFICATION TOKEN
//

userSchema.methods.createEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24h

  return token;
};

//
// 🧹 CLEAN OUTPUT
//

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  delete user.verificationToken;
  delete user.verificationTokenExpiry;
  delete user.__v;

  return user;
};

//
// 🧠 INDEXES
//

userSchema.index({ email: 1 });
userSchema.index({ resetPasswordExpire: 1 });
userSchema.index({ verificationTokenExpiry: 1 });

module.exports = mongoose.model("User", userSchema);
