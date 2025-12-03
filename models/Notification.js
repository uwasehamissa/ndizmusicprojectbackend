const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        'booking_created',
        'booking_updated',
        'status_update',
        'system',
        'admin_alert' 
      ],
      default: 'system'
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },

    sentVia: {
      type: [String], // example: ['email', 'dashboard']
      default: []
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
