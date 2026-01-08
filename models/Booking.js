const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },

    email: {
      type: String,
      required: [true, 'Email is required']
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },

    instrument: {
      type: String,
      required: [true, 'Instrument type is required']
     
    },

    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: [true, 'Experience level is required']
    },

    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required']
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },

    adminNotes: {
      type: String,
      default: ''
    },

    additionalInfo: {
      type: String
    }
  },
  { timestamps: true }
);

// module.exports = mongoose.model('Booking', BookingSchema);
module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
