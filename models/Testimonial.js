const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  instrument: {
    type: String,
    required: [true, 'Instrument is required'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  joinDate: {
    type: String,
    required: [true, 'Join date is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true,
    maxlength: 500
  },
  email: {
    type: String,
    required: [true, 'Email is required for notifications'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  ageGroup: {
    type: String,
    enum: ['child', 'teen', 'adult', 'senior', null],
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 200
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ======================================================
//   UPDATED PRE-SAVE HOOK (NO NEXT CALLBACK)
// ======================================================
testimonialSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// ======================================================
//   ALTERNATIVE: USING TIMESTAMPS OPTION
// ======================================================
// If you prefer automatic timestamp handling, you can use:
// const testimonialSchema = new mongoose.Schema({...}, {
//   timestamps: true
// });
// This automatically adds createdAt and updatedAt fields

// ======================================================
//   ALTERNATIVE: USING PRE-SAVE WITHOUT NEXT (ANOTHER APPROACH)
// ======================================================
// testimonialSchema.pre('save', async function() {
//   if (this.isModified()) {
//     this.updatedAt = Date.now();
//   }
// });

// ======================================================
//   INDEXES FOR PERFORMANCE
// ======================================================
testimonialSchema.index({ status: 1, createdAt: -1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ instrument: 1 });
testimonialSchema.index({ featured: 1, status: 1 });

// ======================================================
//   VIRTUAL FIELD
// ======================================================
testimonialSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// ======================================================
//   SET VIRTUALS TO TRUE FOR TOJSON/TOLOGJECT
// ======================================================
testimonialSchema.set('toJSON', { virtuals: true });
testimonialSchema.set('toObject', { virtuals: true });

// ======================================================
//   EXPORT MODEL
// ======================================================
module.exports = mongoose.model('Testimonial', testimonialSchema);