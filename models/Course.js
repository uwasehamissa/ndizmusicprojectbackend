// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 week'],
    max: [52, 'Duration cannot exceed 52 weeks']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  details: {
    type: String,
    required: [true, 'Course details are required'],
    trim: true,
    maxlength: [500, 'Details cannot exceed 500 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  category: {
    type: String,
    enum: [
      'guitar', 'piano', 'violin', 'drums', 'voice',
      'music-theory', 'composition', 'production', 'other'
    ],
    default: 'other'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'beginner'
  },
  maxStudents: { type: Number, default: 20, min: 1 },
  enrolledStudents: { type: Number, default: 0 },

  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },

  imageUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },

  tags: [{ type: String, trim: true }],
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },

  prerequisites: [{ type: String, trim: true }],
  learningOutcomes: [{ type: String, trim: true }],

  syllabus: [{
    week: Number,
    title: String,
    topics: [String],
    duration: String
  }],

  schedule: {
    startDate: Date,
    endDate: Date,
    days: [String],
    time: String
  },

  materialsIncluded: [{ type: String, trim: true }],

  discount: {
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    expiresAt: Date
  },

  instructor: {
    name: String,
    email: String,
    bio: String
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ courseName: 'text', details: 'text', description: 'text', tags: 'text' });
courseSchema.index({ status: 1, category: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ rating: -1 });
courseSchema.index({ enrolledStudents: -1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ 'discount.expiresAt': 1 });

// Virtuals
courseSchema.virtual('formattedPrice').get(function () {
  if (this.discount?.percentage > 0 &&
    (!this.discount.expiresAt || new Date() < new Date(this.discount.expiresAt))) {
    return {
      original: this.price,
      discounted: this.price * (1 - this.discount.percentage / 100),
      percentage: this.discount.percentage,
      isDiscounted: true
    };
  }
  return {
    original: this.price,
    discounted: null,
    percentage: 0,
    isDiscounted: false
  };
});

courseSchema.virtual('durationText').get(function () {
  return `${this.duration} ${this.duration === 1 ? 'week' : 'weeks'}`;
});

courseSchema.virtual('spotsAvailable').get(function () {
  return this.maxStudents - this.enrolledStudents;
});

courseSchema.virtual('isFull').get(function () {
  return this.enrolledStudents >= this.maxStudents;
});

module.exports = mongoose.model("Course", courseSchema);
