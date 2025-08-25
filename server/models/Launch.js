const mongoose = require('mongoose');

const launchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  vehicle: {
    name: String,
    configuration: String,
    family: String
  },
  mission: {
    name: String,
    description: String,
    type: String,
    orbit: String
  },
  pad: {
    name: String,
    location: String,
    latitude: Number,
    longitude: Number
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    name: String,
    abbrev: String,
    description: String
  },
  probability: {
    type: Number,
    min: 0,
    max: 100
  },
  webcast_live: {
    type: Boolean,
    default: false
  },
  image: {
    type: String
  },
  infographic: {
    type: String
  },
  program: [{
    name: String,
    description: String,
    agencies: [String]
  }],
  orbital_launch_attempt_count: {
    type: Number
  },
  location_launch_attempt_count: {
    type: Number
  },
  pad_launch_attempt_count: {
    type: Number
  },
  agency_launch_attempt_count: {
    type: Number
  },
  orbital_launch_attempt_count_year: {
    type: Number
  },
  location_launch_attempt_count_year: {
    type: Number
  },
  pad_launch_attempt_count_year: {
    type: Number
  },
  agency_launch_attempt_count_year: {
    type: Number
  },
  updates: [{
    comment: String,
    info_url: String,
    created_on: Date
  }],
  net_precision: {
    name: String,
    abbrev: String,
    description: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
launchSchema.index({ date: 1 });
launchSchema.index({ provider: 1 });
launchSchema.index({ 'status.abbrev': 1 });

module.exports = mongoose.model('Launch', launchSchema);
