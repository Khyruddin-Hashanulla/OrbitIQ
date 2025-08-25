const express = require('express');
const axios = require('axios');
const Launch = require('../models/Launch');
const router = express.Router();

// Function to return static launches as fallback
function getStaticLaunches() {
  return [
    {
      _id: 'spacex-starship-test',
      name: 'Starship IFT-4',
      provider: 'SpaceX',
      vehicle: {
        name: 'Starship',
        configuration: 'Super Heavy + Starship',
        family: 'Starship'
      },
      mission: {
        name: 'Integrated Flight Test 4',
        description: 'Fourth integrated flight test of the Starship vehicle system, testing reentry and landing capabilities.',
        type: 'Test Flight',
        orbit: 'Suborbital'
      },
      pad: {
        name: 'Starbase Orbital Launch Mount A',
        location: 'Starbase, Texas, USA',
        latitude: 25.9972,
        longitude: -97.1561
      },
      date: new Date('2024-06-06T12:50:00.000Z'),
      status: {
        name: 'Success',
        abbrev: 'Success',
        description: 'Launch was successful'
      },
      probability: 85,
      webcast_live: false,
      image: 'https://live.staticflickr.com/65535/48954138767_86c4b5b2d7_k.jpg',
      orbital_launch_attempt_count: 4,
      agency_launch_attempt_count: 4
    },
    {
      _id: 'nasa-artemis-2',
      name: 'Artemis II',
      provider: 'NASA',
      vehicle: {
        name: 'Space Launch System Block 1',
        configuration: 'SLS Block 1 + Orion',
        family: 'Space Launch System'
      },
      mission: {
        name: 'Artemis II Lunar Flyby',
        description: 'First crewed mission of the Artemis program, featuring a lunar flyby with four astronauts aboard the Orion spacecraft.',
        type: 'Human Exploration',
        orbit: 'Lunar Trajectory'
      },
      pad: {
        name: 'Launch Complex 39B',
        location: 'Kennedy Space Center, Florida, USA',
        latitude: 28.6272,
        longitude: -80.6214
      },
      date: new Date('2025-11-01T14:00:00.000Z'),
      status: {
        name: 'Go',
        abbrev: 'Go',
        description: 'Launch is proceeding as planned'
      },
      probability: 90,
      webcast_live: false,
      image: 'https://live.staticflickr.com/65535/50630312728_3c8f9b3c4c_k.jpg',
      orbital_launch_attempt_count: 2,
      agency_launch_attempt_count: 2
    },
    {
      _id: 'spacex-crew-9',
      name: 'Crew-9',
      provider: 'SpaceX',
      vehicle: {
        name: 'Falcon 9 Block 5',
        configuration: 'Falcon 9 + Dragon Crew',
        family: 'Falcon 9'
      },
      mission: {
        name: 'Commercial Crew Program Mission 9',
        description: 'Ninth operational crewed flight to the International Space Station under NASA\'s Commercial Crew Program.',
        type: 'Human Spaceflight',
        orbit: 'Low Earth Orbit'
      },
      pad: {
        name: 'Launch Complex 39A',
        location: 'Kennedy Space Center, Florida, USA',
        latitude: 28.6080,
        longitude: -80.6040
      },
      date: new Date('2025-09-15T10:30:00.000Z'),
      status: {
        name: 'Go',
        abbrev: 'Go',
        description: 'Launch is proceeding as planned'
      },
      probability: 95,
      webcast_live: false,
      image: 'https://live.staticflickr.com/65535/51971669206_3d8e4058b4_k.jpg',
      orbital_launch_attempt_count: 350,
      agency_launch_attempt_count: 350
    },
    {
      _id: 'isro-chandrayaan-4',
      name: 'Chandrayaan-4',
      provider: 'ISRO',
      vehicle: {
        name: 'LVM3 M4',
        configuration: 'Launch Vehicle Mark-3',
        family: 'LVM3'
      },
      mission: {
        name: 'Lunar Sample Return Mission',
        description: 'Fourth mission in India\'s lunar exploration program, aimed at collecting and returning lunar samples to Earth.',
        type: 'Lunar Exploration',
        orbit: 'Lunar Transfer'
      },
      pad: {
        name: 'Second Launch Pad',
        location: 'Satish Dhawan Space Centre, India',
        latitude: 13.7199,
        longitude: 80.2304
      },
      date: new Date('2026-03-20T09:15:00.000Z'),
      status: {
        name: 'In Development',
        abbrev: 'TBD',
        description: 'Mission is in development phase'
      },
      probability: 80,
      webcast_live: false,
      image: 'https://live.staticflickr.com/65535/53051578139_46f5283e4b_k.jpg',
      orbital_launch_attempt_count: 8,
      agency_launch_attempt_count: 8
    }
  ];
}

// Get all launches with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { provider, status, page = 1, limit = 12, upcoming = false, search } = req.query;
    console.log('Launches API called with params:', { provider, status, page, limit, upcoming, search });
    
    const query = {};
    
    if (provider) query.provider = { $regex: provider, $options: 'i' };
    if (status) query['status.abbrev'] = status;
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { 'mission.name': { $regex: search, $options: 'i' } },
        { 'mission.description': { $regex: search, $options: 'i' } },
        { 'vehicle.name': { $regex: search, $options: 'i' } },
        { 'pad.location': { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Database query:', JSON.stringify(query));

    let launches = await Launch.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: upcoming === 'true' ? 1 : -1 });

    let total = await Launch.countDocuments(query);
    console.log('Database launches found:', launches.length, 'total:', total);

    // If no launches found in database, use static launches
    if (launches.length === 0) {
      launches = getStaticLaunches();
      total = launches.length;
      console.log('Using static launches fallback:', launches.length);
    }

    res.json({
      launches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in launches API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get launch by ID
router.get('/:id', async (req, res) => {
  try {
    const launch = await Launch.findById(req.params.id);
    if (!launch) {
      return res.status(404).json({ error: 'Launch not found' });
    }
    res.json(launch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming launches
router.get('/upcoming/next', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const launches = await Launch.find({
      date: { $gte: new Date() }
    })
    .limit(parseInt(limit))
    .sort({ date: 1 });

    res.json(launches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync launches from Launch Library API
router.get('/sync/upcoming', async (req, res) => {
  try {
    const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=50');
    const launches = response.data.results;
    
    const syncedLaunches = [];
    
    for (const launch of launches) {
      const launchData = {
        name: launch.name,
        provider: launch.launch_service_provider?.name || 'Unknown',
        vehicle: {
          name: launch.rocket?.configuration?.name || 'Unknown',
          configuration: launch.rocket?.configuration?.full_name,
          family: launch.rocket?.configuration?.family
        },
        mission: {
          name: launch.mission?.name,
          description: launch.mission?.description,
          type: launch.mission?.type,
          orbit: launch.mission?.orbit?.name
        },
        pad: {
          name: launch.pad?.name,
          location: launch.pad?.location?.name,
          latitude: launch.pad?.latitude,
          longitude: launch.pad?.longitude
        },
        date: new Date(launch.net),
        status: {
          name: launch.status?.name,
          abbrev: launch.status?.abbrev,
          description: launch.status?.description
        },
        probability: launch.probability,
        webcast_live: launch.webcast_live,
        image: launch.image,
        infographic: launch.infographic,
        program: launch.program?.map(p => ({
          name: p.name,
          description: p.description,
          agencies: p.agencies?.map(a => a.name) || []
        })) || [],
        orbital_launch_attempt_count: launch.orbital_launch_attempt_count,
        location_launch_attempt_count: launch.location_launch_attempt_count,
        pad_launch_attempt_count: launch.pad_launch_attempt_count,
        agency_launch_attempt_count: launch.agency_launch_attempt_count,
        orbital_launch_attempt_count_year: launch.orbital_launch_attempt_count_year,
        location_launch_attempt_count_year: launch.location_launch_attempt_count_year,
        pad_launch_attempt_count_year: launch.pad_launch_attempt_count_year,
        agency_launch_attempt_count_year: launch.agency_launch_attempt_count_year,
        net_precision: {
          name: launch.net_precision?.name,
          abbrev: launch.net_precision?.abbrev,
          description: launch.net_precision?.description
        }
      };
      
      // Update or create launch
      await Launch.findOneAndUpdate(
        { name: launch.name, date: new Date(launch.net) },
        launchData,
        { upsert: true, new: true }
      );
      
      syncedLaunches.push(launchData);
    }
    
    res.json({ 
      message: `Synced ${syncedLaunches.length} upcoming launches`,
      launches: syncedLaunches.length 
    });
  } catch (error) {
    console.error('Launch sync error:', error.message);
    res.status(500).json({ error: 'Failed to sync launches' });
  }
});

// Get launch statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    const stats = await Launch.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          thisYear: [
            { $match: { date: { $gte: startOfYear } } },
            { $count: "count" }
          ],
          upcoming: [
            { $match: { date: { $gte: now } } },
            { $count: "count" }
          ],
          successful: [
            { $match: { "status.abbrev": "Success" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const providerStats = await Launch.aggregate([
      {
        $group: {
          _id: '$provider',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      overview: {
        total: stats[0].total[0]?.count || 0,
        thisYear: stats[0].thisYear[0]?.count || 0,
        upcoming: stats[0].upcoming[0]?.count || 0,
        successful: stats[0].successful[0]?.count || 0
      },
      topProviders: providerStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
