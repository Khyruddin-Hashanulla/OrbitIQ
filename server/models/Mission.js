const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  agency: {
    type: String,
    required: true,
    enum: ['NASA', 'SpaceX', 'ISRO', 'ESA', 'CNSA', 'Roscosmos', 'JAXA', 'Other']
  },
  type: {
    type: String,
    enum: ['Crewed', 'Cargo', 'Satellite Deployment', 'Planetary', 'Deep Space', 'ISS', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Planned', 'Active', 'Completed', 'Failed', 'Cancelled'],
    default: 'Planned'
  },
  launchDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  description: {
    type: String
  },
  objectives: [{
    type: String
  }],
  crew: [{
    name: String,
    role: String,
    country: String
  }],
  vehicle: {
    name: String,
    type: String,
    manufacturer: String
  },
  destination: {
    type: String
  },
  budget: {
    amount: Number,
    currency: String
  },
  images: [{
    url: String,
    caption: String,
    credit: String
  }],
  links: {
    official: String,
    wikipedia: String,
    video: String
  },
  achievements: [{
    description: String,
    date: Date
  }],
  timeline: [{
    event: String,
    date: Date,
    description: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
missionSchema.index({ agency: 1 });
missionSchema.index({ status: 1 });
missionSchema.index({ type: 1 });
missionSchema.index({ launchDate: 1 });

module.exports = mongoose.model('Mission', missionSchema);
