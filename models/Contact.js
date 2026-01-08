const mongoose = require('mongoose');
const validator = require('validator');

// Contact Model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'archived', 'spam'],
    default: 'pending'
  },
  responseSent: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  userAgent: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Statistics Model
const statsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    default: () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
  },
  totalContacts: {
    type: Number,
    default: 0
  },
  emailsSent: {
    type: Number,
    default: 0
  },
  emailsFailed: {
    type: Number,
    default: 0
  },
  contactByStatus: {
    pending: { type: Number, default: 0 },
    responded: { type: Number, default: 0 },
    archived: { type: Number, default: 0 },
    spam: { type: Number, default: 0 }
  },
  hourlyData: [{
    hour: Number,
    contacts: Number,
    emails: Number
  }]
}, {
  timestamps: true
});

// Stats Methods
statsSchema.methods.incrementContacts = async function(status = 'pending') {
  this.totalContacts += 1;
  if (this.contactByStatus[status] !== undefined) {
    this.contactByStatus[status] += 1;
  }
  
  const hour = new Date().getHours();
  const hourData = this.hourlyData.find(h => h.hour === hour);
  
  if (hourData) {
    hourData.contacts += 1;
  } else {
    this.hourlyData.push({ hour, contacts: 1, emails: 0 });
  }
  
  return this.save();
};

statsSchema.methods.incrementEmailsSent = async function() {
  this.emailsSent += 1;
  
  const hour = new Date().getHours();
  const hourData = this.hourlyData.find(h => h.hour === hour);
  
  if (hourData) {
    hourData.emails += 1;
  }
  
  return this.save();
};

statsSchema.statics.getTodayStats = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let stats = await this.findOne({ date: today });
  
  if (!stats) {
    stats = await this.create({ date: today });
  }
  
  return stats;
};

// Create Models
const Contact = mongoose.model('Contact', contactSchema);
const Stats = mongoose.model('Stats', statsSchema);

module.exports = { Contact, Stats };