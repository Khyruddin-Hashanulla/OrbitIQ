import React, { useState, useEffect } from 'react';
import { Satellite, MapPin, Clock, Zap, Search, Filter, X, Calendar, Globe, Activity } from 'lucide-react';
import axios from 'axios';

// Configure axios base URL - Fix for mobile deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'http://localhost:5000');
console.log('API Base URL:', API_BASE_URL);

const Satellites = () => {
  const [satellites, setSatellites] = useState([]);
  const [issPosition, setIssPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['ISS', 'Communication', 'Weather', 'Navigation', 'Scientific', 'Military', 'Other'];

  useEffect(() => {
    fetchSatellites();
    fetchISSPosition();
    
    // Update ISS position every 5 seconds
    const interval = setInterval(fetchISSPosition, 5000);
    return () => clearInterval(interval);
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchSatellites = async () => {
    try {
      setError(null);
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      };
      
      console.log('Fetching satellites with params:', params);
      console.log('Making request to:', `${API_BASE_URL}/api/satellites`);
      
      const response = await axios.get(`${API_BASE_URL}/api/satellites`, { 
        params,
        timeout: 30000 // Increase to 30 seconds for production
      });
      
      console.log('API response:', response.data);
      console.log('Satellites received:', response.data.satellites?.length || 0);
      
      setSatellites(response.data.satellites || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching satellites:', error);
      setError(`Failed to load satellite data. ${error.response?.data?.error || error.message}`);
      
      // If it's a timeout, show a more helpful message
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError('Satellite data is taking longer than expected to load. The server may be starting up or experiencing high load. Please try again in a moment.');
      }
      
      setLoading(false);
    }
  };

  const fetchISSPosition = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/satellites/iss/position`, {
        timeout: 8000
      });
      setIssPosition(response.data);
    } catch (error) {
      console.error('Error fetching ISS position:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'ISS': 'bg-gradient-to-r from-space-gold to-yellow-400',
      'Communication': 'bg-gradient-to-r from-blue-500 to-cyan-400',
      'Weather': 'bg-gradient-to-r from-green-500 to-emerald-400',
      'Navigation': 'bg-gradient-to-r from-purple-500 to-pink-400',
      'Scientific': 'bg-gradient-to-r from-indigo-500 to-blue-400',
      'Military': 'bg-gradient-to-r from-red-500 to-orange-400',
      'Other': 'bg-gradient-to-r from-gray-500 to-slate-400'
    };
    return colors[category] || colors['Other'];
  };

  const openSatelliteDetails = (satellite) => {
    setSelectedSatellite(satellite);
    setShowModal(true);
  };

  const closeSatelliteDetails = () => {
    setSelectedSatellite(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-50">
          <span className="text-space-cyan">Satellite</span> Tracking
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Track thousands of satellites in real-time, including the International Space Station
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card p-6 border-red-500/50">
          <div className="flex items-center space-x-3 text-red-400">
            <Satellite className="w-6 h-6" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ISS Live Position */}
      {issPosition && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-space-gold to-yellow-400 rounded-full flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-space-gold">International Space Station</h2>
                <p className="text-gray-300">Live Position</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-space-cyan" />
              <div>
                <p className="text-sm text-gray-300">Coordinates</p>
                <p className="font-mono text-lg text-gray-100">
                  {issPosition.position.latitude.toFixed(4)}°, {issPosition.position.longitude.toFixed(4)}°
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-space-purple" />
              <div>
                <p className="text-sm text-gray-300">Altitude</p>
                <p className="font-mono text-lg text-gray-100">{issPosition.position.altitude || 408} km</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-space-gold" />
              <div>
                <p className="text-sm text-gray-300">Last Update</p>
                <p className="text-sm text-gray-100">{formatDate(issPosition.position.timestamp)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search satellites by name or country..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan text-gray-100 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan appearance-none text-gray-100"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Satellites Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-space-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading satellites...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {satellites.map((satellite) => (
            <div key={satellite._id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-50">{satellite.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">NORAD ID: {satellite.noradId}</p>
                  {satellite.country && (
                    <p className="text-sm text-gray-300">Country: {satellite.country}</p>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(satellite.category)}`}>
                  {satellite.category}
                </div>
              </div>

              {satellite.position && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Latitude:</span>
                    <span className="font-mono text-gray-100">
                      {satellite.position.latitude !== null && satellite.position.latitude !== undefined ? `${satellite.position.latitude.toFixed(4)}°` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Longitude:</span>
                    <span className="font-mono text-gray-100">
                      {satellite.position.longitude !== null && satellite.position.longitude !== undefined ? `${satellite.position.longitude.toFixed(4)}°` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Altitude:</span>
                    <span className="font-mono text-gray-100">
                      {satellite.position.altitude !== null && satellite.position.altitude !== undefined ? `${satellite.position.altitude.toFixed(1)} km` : 'N/A'}
                    </span>
                  </div>
                  {satellite.position.velocity && satellite.position.velocity !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Velocity:</span>
                      <span className="font-mono text-gray-100">
                        {satellite.position.velocity.toFixed(1)} km/h
                        {satellite.position.velocitySource && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({satellite.position.velocitySource === 'API' ? 'Live' : 
                              satellite.position.velocitySource === 'CALCULATED' ? 'Calc' : 'Sim'})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  satellite.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                  satellite.status === 'Inactive' ? 'bg-red-500/20 text-red-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {satellite.status}
                </span>
                <button className="text-space-cyan hover:text-white transition-colors text-sm font-medium" onClick={() => openSatelliteDetails(satellite)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {satellites.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Satellite className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-300">No satellites found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Satellite Details Modal */}
      {showModal && selectedSatellite && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(selectedSatellite.category)}`}>
                  <Satellite className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-50">{selectedSatellite.name}</h2>
                  <p className="text-gray-300">NORAD ID: {selectedSatellite.noradId}</p>
                </div>
              </div>
              <button 
                onClick={closeSatelliteDetails}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-space-cyan" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-300">International Designator</p>
                      <p className="font-mono text-gray-100">{selectedSatellite.intlDes || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Country</p>
                      <p className="text-gray-100">{selectedSatellite.country || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">Category</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(selectedSatellite.category)}`}>
                        {selectedSatellite.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-300">Status</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedSatellite.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                        selectedSatellite.status === 'Inactive' ? 'bg-red-500/20 text-red-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {selectedSatellite.status}
                      </span>
                    </div>
                    {selectedSatellite.launchDate && (
                      <div>
                        <p className="text-sm text-gray-300">Launch Date</p>
                        <p className="text-gray-100 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-space-gold" />
                          {new Date(selectedSatellite.launchDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Position */}
              {selectedSatellite.position && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-space-purple" />
                    Current Position
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-300">Latitude</p>
                        <p className="font-mono text-lg text-gray-100">
                          {selectedSatellite.position.latitude !== null && selectedSatellite.position.latitude !== undefined ? `${selectedSatellite.position.latitude.toFixed(6)}°` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Longitude</p>
                        <p className="font-mono text-lg text-gray-100">
                          {selectedSatellite.position.longitude !== null && selectedSatellite.position.longitude !== undefined ? `${selectedSatellite.position.longitude.toFixed(6)}°` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-300">Altitude</p>
                        <p className="font-mono text-lg text-gray-100">
                          {selectedSatellite.position.altitude !== null && selectedSatellite.position.altitude !== undefined ? `${selectedSatellite.position.altitude.toFixed(2)} km` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Velocity</p>
                        <p className="font-mono text-lg text-gray-100">
                          {selectedSatellite.position.velocity !== null && selectedSatellite.position.velocity !== undefined ? `${selectedSatellite.position.velocity.toFixed(2)} km/h` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedSatellite.position.timestamp && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-sm text-gray-300">Last Updated</p>
                      <p className="text-gray-100 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-space-gold" />
                        {formatDate(selectedSatellite.position.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Orbital Parameters */}
              {selectedSatellite.orbital && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-space-cyan" />
                    Orbital Parameters
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {selectedSatellite.orbital.period && (
                        <div>
                          <p className="text-sm text-gray-300">Orbital Period</p>
                          <p className="font-mono text-gray-100">{selectedSatellite.orbital.period} minutes</p>
                        </div>
                      )}
                      {selectedSatellite.orbital.inclination && (
                        <div>
                          <p className="text-sm text-gray-300">Inclination</p>
                          <p className="font-mono text-gray-100">{selectedSatellite.orbital.inclination}°</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {selectedSatellite.orbital.apogee && (
                        <div>
                          <p className="text-sm text-gray-300">Apogee</p>
                          <p className="font-mono text-gray-100">{selectedSatellite.orbital.apogee} km</p>
                        </div>
                      )}
                      {selectedSatellite.orbital.perigee && (
                        <div>
                          <p className="text-sm text-gray-300">Perigee</p>
                          <p className="font-mono text-gray-100">{selectedSatellite.orbital.perigee} km</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-gray-400">
                  Database last updated: {formatDate(selectedSatellite.lastUpdated || selectedSatellite.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Satellites;
