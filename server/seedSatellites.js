const mongoose = require('mongoose');
const Satellite = require('./models/Satellite');
require('dotenv').config();

// Sample satellite data
const sampleSatellites = [
  {
    noradId: 25544,
    name: "International Space Station (ISS)",
    intlDes: "1998-067A",
    launchDate: new Date("1998-11-20"),
    country: "International",
    category: "ISS",
    status: "Active",
    orbital: {
      period: 92.68,
      inclination: 51.64,
      apogee: 408,
      perigee: 408
    }
  },
  {
    noradId: 44713,
    name: "Starlink-1007",
    intlDes: "2019-074A",
    launchDate: new Date("2019-11-11"),
    country: "USA",
    category: "Communication",
    status: "Active",
    orbital: {
      period: 95.0,
      inclination: 53.0,
      apogee: 550,
      perigee: 540
    }
  },
  {
    noradId: 33591,
    name: "NOAA-19",
    intlDes: "2009-005A",
    launchDate: new Date("2009-02-06"),
    country: "USA",
    category: "Weather",
    status: "Active",
    orbital: {
      period: 102.1,
      inclination: 99.2,
      apogee: 870,
      perigee: 854
    }
  },
  {
    noradId: 28474,
    name: "GPS BIIR-13 (PRN 13)",
    intlDes: "2004-045A",
    launchDate: new Date("2004-11-06"),
    country: "USA",
    category: "Navigation",
    status: "Active",
    orbital: {
      period: 717.9,
      inclination: 55.4,
      apogee: 20200,
      perigee: 20180
    }
  },
  {
    noradId: 20580,
    name: "Hubble Space Telescope",
    intlDes: "1990-037B",
    launchDate: new Date("1990-04-24"),
    country: "USA",
    category: "Scientific",
    status: "Active",
    orbital: {
      period: 96.4,
      inclination: 28.5,
      apogee: 540,
      perigee: 535
    }
  },
  {
    noradId: 37348,
    name: "Kepler",
    intlDes: "2009-011A",
    launchDate: new Date("2009-03-07"),
    country: "USA",
    category: "Scientific",
    status: "Inactive",
    orbital: {
      period: 372.5,
      inclination: 0.5,
      apogee: 150000000,
      perigee: 150000000
    }
  },
  {
    noradId: 38771,
    name: "GOES-14",
    intlDes: "2009-033A",
    launchDate: new Date("2009-06-27"),
    country: "USA",
    category: "Weather",
    status: "Active",
    orbital: {
      period: 1436.1,
      inclination: 0.3,
      apogee: 35800,
      perigee: 35780
    }
  },
  {
    noradId: 41783,
    name: "Sentinel-3A",
    intlDes: "2016-011A",
    launchDate: new Date("2016-02-16"),
    country: "ESA",
    category: "Scientific",
    status: "Active",
    orbital: {
      period: 100.99,
      inclination: 98.65,
      apogee: 815,
      perigee: 808
    }
  },
  {
    noradId: 43013,
    name: "GSAT-6A",
    intlDes: "2018-027A",
    launchDate: new Date("2018-03-29"),
    country: "India",
    category: "Communication",
    status: "Inactive",
    orbital: {
      period: 1436.1,
      inclination: 0.1,
      apogee: 35790,
      perigee: 35780
    }
  },
  {
    noradId: 44506,
    name: "RISAT-2B",
    intlDes: "2019-035A",
    launchDate: new Date("2019-05-22"),
    country: "India",
    category: "Scientific",
    status: "Active",
    orbital: {
      period: 96.4,
      inclination: 37.0,
      apogee: 557,
      perigee: 549
    }
  }
];

async function seedSatellites() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orbitiq', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing satellites
    await Satellite.deleteMany({});
    console.log('🗑️  Cleared existing satellites');

    // Insert sample satellites
    await Satellite.insertMany(sampleSatellites);
    console.log(`🛰️  Seeded ${sampleSatellites.length} satellites`);

    console.log('✅ Satellite seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding satellites:', error);
    process.exit(1);
  }
}

seedSatellites();
