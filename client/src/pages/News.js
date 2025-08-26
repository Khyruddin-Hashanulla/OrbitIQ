import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, User, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

// Configure axios base URL - Fix for development and deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log('API Base URL:', API_BASE_URL);

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  const sources = ['BBC News', 'CNN', 'The Verge', 'TechCrunch', 'Reuters', 'Associated Press'];

  const fetchNews = async () => {
    try {
      const params = {
        page: 1,
        limit: 12,
        ...(selectedSource && { source: selectedSource.toLowerCase().replace(' ', '-') })
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/news`, { params });
      setArticles(response.data.articles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedSource, searchTerm]);

  const formatPublishDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getSourceColor = (source) => {
    const colors = {
      'BBC News': 'from-red-600 to-red-400',
      'CNN': 'from-red-700 to-red-500',
      'The Verge': 'from-purple-600 to-purple-400',
      'TechCrunch': 'from-green-600 to-green-400',
      'Reuters': 'from-blue-600 to-blue-400',
      'Associated Press': 'from-gray-600 to-gray-400'
    };
    return colors[source] || 'from-gray-600 to-gray-400';
  };

  const handleCategoryClick = (category) => {
    if (category === 'nasa') {
      setSelectedSource('NASA');
    } else if (category === 'spacex') {
      setSelectedSource('SpaceX');
    } else if (category === 'trending') {
      setSearchTerm('');
      setSelectedSource('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Space <span className="text-green-400">News</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest space discoveries, research, and breakthrough announcements
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search space news..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan appearance-none"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading space news...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article key={index} className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
              {article.urlToImage && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getSourceColor(article.source)}`}>
                  {article.source}
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{formatPublishDate(article.publishedAt)}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-3 text-white group-hover:text-green-400 transition-colors line-clamp-2">
                {article.title}
              </h3>

              {article.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                {article.author && (
                  <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-32">{article.author}</span>
                  </div>
                )}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-green-400 hover:text-white transition-colors text-sm font-medium"
                >
                  <span>Read More</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {articles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No news articles found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Featured Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">NASA Updates</h3>
          <p className="text-gray-400 text-sm mb-4">Latest news from NASA missions and discoveries</p>
          <button 
            className="text-blue-400 hover:text-white transition-colors text-sm font-medium"
            onClick={() => handleCategoryClick('nasa')}
          >
            View NASA News
          </button>
        </div>

        <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">SpaceX News</h3>
          <p className="text-gray-400 text-sm mb-4">Updates on SpaceX launches and innovations</p>
          <button 
            className="text-green-400 hover:text-white transition-colors text-sm font-medium"
            onClick={() => handleCategoryClick('spacex')}
          >
            View SpaceX News
          </button>
        </div>

        <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Trending Topics</h3>
          <p className="text-gray-400 text-sm mb-4">Most popular space stories and discussions</p>
          <button 
            className="text-orange-400 hover:text-white transition-colors text-sm font-medium"
            onClick={() => handleCategoryClick('trending')}
          >
            View Trending
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
