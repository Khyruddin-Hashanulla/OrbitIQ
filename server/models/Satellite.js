const mongoose = require('mongoose');

const satelliteSchema = new mongoose.Schema({
  noradId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  intlDes: {
    type: String,
    required: true
  },
  launchDate: {
    type: Date
  },
  country: {
    type: String
  },
  category: {
    type: String,
    enum: ['ISS', 'Communication', 'Weather', 'Navigation', 'Scientific', 'Military', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Decayed', 'Unknown'],
    default: 'Unknown'
  },
  position: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    velocity: Number,
    timestamp: Date
  },
  orbital: {
    period: Number,
    inclination: Number,
    apogee: Number,
    perigee: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
satelliteSchema.index({ noradId: 1 });
satelliteSchema.index({ category: 1 });
satelliteSchema.index({ status: 1 });

module.exports = mongoose.model('Satellite', satelliteSchema);
