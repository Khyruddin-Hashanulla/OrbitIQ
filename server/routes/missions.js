const express = require('express');
const axios = require('axios');
const Mission = require('../models/Mission');
const router = express.Router();

// Function to return static missions
function getStaticMissions() {
  return [
    {
      _id: 'apollo11',
      name: 'Apollo 11',
      agency: 'NASA',
      type: 'Crewed',
      status: 'Completed',
      launchDate: new Date('1969-07-16T14:32:00.000Z'),
      description: 'First crewed mission to land humans on the Moon. Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface.',
      destination: 'Moon',
      crew: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'],
      vehicle: {
        name: 'Saturn V',
        type: 'Rocket',
        manufacturer: 'NASA'
      },
      links: {
        official: 'https://www.nasa.gov/mission_pages/apollo/missions/apollo11.html',
        wikipedia: 'https://en.wikipedia.org/wiki/Apollo_11'
      }
    },
    {
      _id: 'artemis1',
      name: 'Artemis I',
      agency: 'NASA',
      type: 'Uncrewed',
      status: 'Completed',
      launchDate: new Date('2022-11-16T06:47:00.000Z'),
      description: 'Uncrewed test flight of the Orion spacecraft around the Moon as part of the Artemis program.',
      destination: 'Moon',
      crew: [],
      vehicle: {
        name: 'Space Launch System (SLS)',
        type: 'Rocket',
        manufacturer: 'NASA'
      },
      links: {
        official: 'https://www.nasa.gov/artemis-1/',
        wikipedia: 'https://en.wikipedia.org/wiki/Artemis_1'
      }
    },
    {
      _id: 'crew6',
      name: 'SpaceX Crew-6',
      agency: 'SpaceX',
      type: 'Crewed',
      status: 'Completed',
      launchDate: new Date('2023-03-02T05:34:00.000Z'),
      description: 'Sixth operational crewed flight of the Crew Dragon spacecraft to the International Space Station.',
      destination: 'International Space Station',
      crew: ['Stephen Bowen', 'Warren Hoburg', 'Sultan Alneyadi', 'Andrey Fedyaev'],
      vehicle: {
        name: 'Falcon 9',
        type: 'Rocket',
        manufacturer: 'SpaceX'
      },
      links: {
        official: 'https://www.spacex.com/missions/crew-6/',
        wikipedia: 'https://en.wikipedia.org/wiki/SpaceX_Crew-6'
      }
    },
    {
      _id: 'jwst',
      name: 'James Webb Space Telescope',
      agency: 'NASA',
      type: 'Scientific',
      status: 'Active',
      launchDate: new Date('2021-12-25T12:20:00.000Z'),
      description: 'Revolutionary space telescope designed to observe the universe in infrared light, studying the formation of the first galaxies.',
      destination: 'L2 Lagrange Point',
      crew: [],
      vehicle: {
        name: 'Ariane 5',
        type: 'Rocket',
        manufacturer: 'ESA'
      },
      links: {
        official: 'https://www.nasa.gov/webb/',
        wikipedia: 'https://en.wikipedia.org/wiki/James_Webb_Space_Telescope'
      }
    },
    {
      _id: 'perseverance',
      name: 'Mars 2020 Perseverance',
      agency: 'NASA',
      type: 'Robotic',
      status: 'Active',
      launchDate: new Date('2020-07-30T11:50:00.000Z'),
      description: 'Advanced rover mission to search for signs of ancient microbial life on Mars and collect rock samples for future return to Earth.',
      destination: 'Mars',
      crew: [],
      vehicle: {
        name: 'Atlas V',
        type: 'Rocket',
        manufacturer: 'ULA'
      },
      links: {
        official: 'https://mars.nasa.gov/mars2020/',
        wikipedia: 'https://en.wikipedia.org/wiki/Mars_2020'
      }
    },
    {
      _id: 'chandrayaan3',
      name: 'Chandrayaan-3',
      agency: 'ISRO',
      type: 'Robotic',
      status: 'Completed',
      launchDate: new Date('2023-07-14T09:05:00.000Z'),
      description: 'Third lunar exploration mission by ISRO, successfully achieved soft landing near the Moon\'s south pole.',
      destination: 'Moon',
      crew: [],
      vehicle: {
        name: 'LVM3',
        type: 'Rocket',
        manufacturer: 'ISRO'
      },
      links: {
        official: 'https://www.isro.gov.in/Chandrayaan3.html',
        wikipedia: 'https://en.wikipedia.org/wiki/Chandrayaan-3'
      }
    }
  ];
}

// Get all missions with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { agency, status, type, page = 1, limit = 12, search } = req.query;
    console.log('Missions API called with params:', { agency, status, type, page, limit, search });
    
    // If no missions in database, return filtered static missions
    const missionCount = await Mission.countDocuments();
    console.log('Database mission count:', missionCount);
    
    if (missionCount === 0) {
      let filteredMissions = getStaticMissions();
      console.log('Using static missions, total:', filteredMissions.length);
      
      // Apply filters to static missions
      if (agency) {
        filteredMissions = filteredMissions.filter(m => m.agency === agency);
        console.log('After agency filter:', filteredMissions.length);
      }
      if (status) {
        filteredMissions = filteredMissions.filter(m => m.status === status);
        console.log('After status filter:', filteredMissions.length);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredMissions = filteredMissions.filter(m => 
          m.name.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower) ||
          (m.destination && m.destination.toLowerCase().includes(searchLower))
        );
        console.log('After search filter:', filteredMissions.length);
      }
      
      return res.json({
        missions: filteredMissions,
        totalPages: 1,
        currentPage: 1,
        total: filteredMissions.length
      });
    }
    
    const query = {};
    
    if (agency) query.agency = agency;
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Database query:', JSON.stringify(query));

    const missions = await Mission.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ launchDate: -1 });

    const total = await Mission.countDocuments(query);
    console.log('Database missions found:', missions.length, 'total:', total);

    res.json({
      missions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in missions API:', error);
    // Fallback to static missions on error with filtering
    let filteredMissions = getStaticMissions();
    const { agency, status, search } = req.query;
    
    if (agency) {
      filteredMissions = filteredMissions.filter(m => m.agency === agency);
    }
    if (status) {
      filteredMissions = filteredMissions.filter(m => m.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMissions = filteredMissions.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.description.toLowerCase().includes(searchLower) ||
        (m.destination && m.destination.toLowerCase().includes(searchLower))
      );
    }
    
    console.log('Error fallback - returning static missions:', filteredMissions.length);
    
    res.json({
      missions: filteredMissions,
      totalPages: 1,
      currentPage: 1,
      total: filteredMissions.length
    });
  }
});

// Get mission by ID
router.get('/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch SpaceX missions from API
router.get('/spacex/sync', async (req, res) => {
  try {
    console.log('SpaceX sync initiated...');
    const response = await axios.get('https://api.spacexdata.com/v4/launches');
    const launches = response.data;
    console.log(`Fetched ${launches.length} SpaceX launches from API`);
    
    // Fetch rocket data separately
    const rocketsResponse = await axios.get('https://api.spacexdata.com/v4/rockets');
    const rockets = rocketsResponse.data;
    const rocketMap = rockets.reduce((map, rocket) => {
      map[rocket.id] = rocket;
      return map;
    }, {});
    console.log(`Fetched ${rockets.length} rocket types`);
    
    const missions = [];
    
    for (const launch of launches.slice(0, 50)) { // Limit to 50 recent missions
      // Get rocket details
      const rocket = rocketMap[launch.rocket] || { name: 'Unknown' };
      
      const missionData = {
        name: launch.name,
        agency: 'SpaceX',
        type: launch.crew && launch.crew.length > 0 ? 'Crewed' : 'Cargo',
        status: launch.success === true ? 'Completed' : 
                launch.success === false ? 'Failed' : 
                launch.upcoming ? 'Planned' : 'Active',
        launchDate: new Date(launch.date_utc),
        description: launch.details || `SpaceX ${launch.name} mission`,
        crew: launch.crew ? launch.crew.map(crewId => `Crew Member ${crewId}`) : [],
        vehicle: {
          name: rocket.name || 'Unknown',
          type: 'Rocket',
          manufacturer: 'SpaceX'
        },
        links: {
          official: launch.links?.webcast,
          wikipedia: launch.links?.wikipedia,
          video: launch.links?.webcast
        }
      };
      
      // Update or create mission
      const result = await Mission.findOneAndUpdate(
        { name: launch.name, agency: 'SpaceX' },
        missionData,
        { upsert: true, new: true }
      );
      
      console.log(`${result.isNew ? 'Created' : 'Updated'} mission: ${launch.name} with rocket: ${rocket.name}`);
      missions.push(missionData);
    }
    
    console.log(`SpaceX sync completed: ${missions.length} missions processed`);
    
    res.json({ 
      message: `Synced ${missions.length} SpaceX missions`,
      missions: missions.length 
    });
  } catch (error) {
    console.error('SpaceX sync error:', error.message);
    res.status(500).json({ error: 'Failed to sync SpaceX missions', details: error.message });
  }
});

// Get mission statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Mission.aggregate([
      {
        $group: {
          _id: null,
          totalMissions: { $sum: 1 },
          activeMissions: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          completedMissions: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          plannedMissions: {
            $sum: { $cond: [{ $eq: ['$status', 'Planned'] }, 1, 0] }
          }
        }
      }
    ]);

    const agencyStats = await Mission.aggregate([
      {
        $group: {
          _id: '$agency',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const typeStats = await Mission.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || {
        totalMissions: 0,
        activeMissions: 0,
        completedMissions: 0,
        plannedMissions: 0
      },
      byAgency: agencyStats,
      byType: typeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
