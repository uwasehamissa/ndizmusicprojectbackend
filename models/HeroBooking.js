const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  instrument: {
    type: String,
    required: [true, 'Instrument is required'],
    enum: ['guitar', 'piano', 'violin', 'drums', 'flute', 'saxophone', 'trumpet', 'bass', 'cello', 'clarinet'],
    default: 'guitar'
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    default: 'beginner'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
    index: true
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  lessonDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
    index: true
  },

  emailSent: {
    type: Boolean,
    default: false
  },
  lastEmailSentAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ email: 1, bookingDate: -1 });
bookingSchema.index({ instrument: 1, experience: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for formatted dates
bookingSchema.virtual('formattedBookingDate').get(function() {
  return this.bookingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

bookingSchema.virtual('formattedLessonDate').get(function() {
  if (!this.lessonDate) return 'Not scheduled';
  return this.lessonDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for contact info
bookingSchema.virtual('contactInfo').get(function() {
  return {
    name: this.name,
    email: this.email,
    phone: this.phone,
    preferredContact: 'email'
  };
});

// Instance method to mark email as sent
bookingSchema.methods.markEmailAsSent = function() {
  this.emailSent = true;
  this.lastEmailSentAt = new Date();
  return this.save();
};

// Static method to find bookings by status
bookingSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Static method to find upcoming lessons
bookingSchema.statics.findUpcoming = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  return this.find({
    status: 'confirmed',
    lessonDate: {
      $gte: new Date(),
      $lte: date
    }
  }).sort({ lessonDate: 1 });
};

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  
  // Ensure phone is formatted
  if (this.isModified('phone')) {
    this.phone = this.phone.replace(/\s+/g, '');
  }
  
  next();
});

// Post-save middleware
bookingSchema.post('save', function(doc, next) {
  console.log(`Booking saved: ${doc.name} - ${doc.instrument}`);
  next();
});

// Check if the model already exists before compiling it
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

module.exports = Booking;