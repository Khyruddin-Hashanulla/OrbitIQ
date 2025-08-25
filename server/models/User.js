const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    favoriteAgencies: [{
      type: String,
      enum: ['NASA', 'SpaceX', 'ISRO', 'ESA', 'CNSA', 'Roscosmos', 'JAXA', 'Other']
    }],
    favoriteSatellites: [{
      noradId: Number,
      name: String
    }],
    favoriteMissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission'
    }],
    notifications: {
      launches: {
        type: Boolean,
        default: true
      },
      missions: {
        type: Boolean,
        default: true
      },
      news: {
        type: Boolean,
        default: false
      }
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
