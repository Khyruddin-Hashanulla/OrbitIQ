const express = require('express');
const axios = require('axios');
const router = express.Router();

// Function to return static space news
function getStaticSpaceNews() {
  return [
    {
      title: 'NASA\'s Artemis III Mission Targets 2026 Moon Landing',
      description: 'NASA announces updated timeline for crewed lunar landing mission with advanced spacesuits and lunar lander technology.',
      url: 'https://www.nasa.gov/artemis-iii-mission-update',
      urlToImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'NASA',
      author: 'NASA Communications'
    },
    {
      title: 'SpaceX Successfully Launches 23 Starlink Satellites',
      description: 'Falcon 9 rocket delivers another batch of internet satellites to low Earth orbit, expanding global connectivity coverage.',
      url: 'https://www.spacex.com/launches/starlink-mission',
      urlToImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'SpaceX',
      author: 'SpaceX Team'
    },
    {
      title: 'James Webb Telescope Discovers Ancient Galaxy Formation',
      description: 'New observations reveal how the first galaxies formed in the early universe, providing insights into cosmic evolution.',
      url: 'https://www.nasa.gov/webb-galaxy-discovery',
      urlToImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'NASA',
      author: 'Webb Science Team'
    },
    {
      title: 'International Space Station Receives New Research Modules',
      description: 'Crew Dragon delivers cutting-edge scientific equipment for microgravity experiments and space medicine research.',
      url: 'https://www.nasa.gov/iss-research-update',
      urlToImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'NASA',
      author: 'ISS Program Office'
    },
    {
      title: 'Mars Perseverance Rover Finds Evidence of Ancient Water',
      description: 'Latest soil samples from Jezero Crater show clear signs of past water activity and potential biosignatures.',
      url: 'https://mars.nasa.gov/perseverance-discovery',
      urlToImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'NASA JPL',
      author: 'Mars 2020 Team'
    },
    {
      title: 'European Space Agency Plans Jupiter Moon Mission',
      description: 'ESA announces JUICE mission timeline to explore Europa and Ganymede for signs of subsurface oceans.',
      url: 'https://www.esa.int/juice-mission-update',
      urlToImage: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800',
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'ESA',
      author: 'ESA Communications'
    }
  ];
}

// Get space news from NewsAPI
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, source } = req.query;
    
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      // Fallback to static space news if API key not available
      return res.json({
        articles: getStaticSpaceNews(),
        totalResults: 20,
        currentPage: parseInt(page),
        totalPages: 2
      });
    }

    const spaceKeywords = 'space OR NASA OR SpaceX OR satellite OR rocket OR ISS OR Mars OR moon OR astronomy OR "James Webb" OR Artemis';
    let sources = 'bbc-news,cnn,the-verge,techcrunch,reuters,associated-press';
    
    // Handle source filtering
    if (source) {
      const sourceMap = {
        'nasa': 'nasa.gov,space.com,spacenews.com',
        'spacex': 'techcrunch,the-verge,reuters',
        'BBC News': 'bbc-news',
        'CNN': 'cnn',
        'The Verge': 'the-verge',
        'TechCrunch': 'techcrunch',
        'Reuters': 'reuters',
        'Associated Press': 'associated-press'
      };
      sources = sourceMap[source] || sources;
    }
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: spaceKeywords,
        sources: sources,
        sortBy: 'publishedAt',
        language: 'en',
        page: page,
        pageSize: limit,
        apiKey: newsApiKey
      },
      timeout: 8000
    });

    const articles = response.data.articles
      .filter(article => article.title && article.description && !article.title.includes('[Removed]'))
      .map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        author: article.author
      }));

    res.json({
      articles,
      totalResults: response.data.totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(response.data.totalResults / limit)
    });
  } catch (error) {
    console.error('News API Error:', error.message);
    
    // Fallback to static news on API failure
    res.json({
      articles: getStaticSpaceNews(),
      totalResults: 20,
      currentPage: 1,
      totalPages: 2
    });
  }
});

// Get NASA news and updates
router.get('/nasa', async (req, res) => {
  try {
    // NASA doesn't have a direct news API, so we'll use NewsAPI with NASA-specific search
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'NASA',
        domains: 'nasa.gov,space.com,spacenews.com',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 20,
        apiKey: newsApiKey
      }
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author
    }));

    res.json({ articles });
  } catch (error) {
    console.error('NASA News Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch NASA news' });
  }
});

// Get SpaceX news and updates
router.get('/spacex', async (req, res) => {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'SpaceX OR "Elon Musk" space',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 20,
        apiKey: newsApiKey
      }
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source.name,
      author: article.author
    }));

    res.json({ articles });
  } catch (error) {
    console.error('SpaceX News Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch SpaceX news' });
  }
});

// Get trending space topics
router.get('/trending', async (req, res) => {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    const trendingTopics = [
      'Mars mission',
      'James Webb telescope',
      'International Space Station',
      'Artemis program',
      'satellite launch'
    ];

    const promises = trendingTopics.map(topic => 
      axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: topic,
          sortBy: 'popularity',
          language: 'en',
          pageSize: 3,
          apiKey: newsApiKey
        }
      })
    );

    const responses = await Promise.all(promises);
    const trending = {};

    responses.forEach((response, index) => {
      const topic = trendingTopics[index];
      trending[topic] = response.data.articles.slice(0, 3).map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name
      }));
    });

    res.json({ trending });
  } catch (error) {
    console.error('Trending News Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending space news' });
  }
});

module.exports = router;
