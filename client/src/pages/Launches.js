import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Rocket, Clock, ExternalLink, Search, Filter, Play, X, Globe, Users, Target } from 'lucide-react';
import axios from 'axios';
import { format, formatDistanceToNow, isAfter } from 'date-fns';

const Launches = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  const providers = ['SpaceX', 'NASA', 'ULA', 'Blue Origin', 'Rocket Lab', 'ISRO', 'ESA', 'Roscosmos'];

  useEffect(() => {
    fetchLaunches();
  }, [selectedProvider, showUpcoming, searchTerm]);

  const fetchLaunches = async () => {
    try {
      const params = {
        upcoming: showUpcoming,
        ...(selectedProvider && { provider: selectedProvider }),
        ...(searchTerm && { search: searchTerm })
      };
      
      console.log('Fetching launches with params:', params);
      
      const response = await axios.get('/api/launches', { params });
      console.log('Launches response:', response.data);
      setLaunches(response.data.launches || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching launches:', error);
      setLoading(false);
    }
  };

  const syncUpcomingLaunches = async () => {
    try {
      setLoading(true);
      await axios.get('/api/launches/sync/upcoming');
      fetchLaunches();
    } catch (error) {
      console.error('Error syncing launches:', error);
      setLoading(false);
    }
  };

  const formatLaunchDate = (date) => {
    return format(new Date(date), 'PPP p');
  };

  const getTimeUntilLaunch = (date) => {
    const launchDate = new Date(date);
    if (isAfter(launchDate, new Date())) {
      return formatDistanceToNow(launchDate, { addSuffix: true });
    }
    return 'Launched';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Go': 'bg-green-500/20 text-green-400',
      'TBD': 'bg-yellow-500/20 text-yellow-400',
      'Success': 'bg-emerald-500/20 text-emerald-400',
      'Failure': 'bg-red-500/20 text-red-400',
      'Hold': 'bg-orange-500/20 text-orange-400',
      'In Flight': 'bg-blue-500/20 text-blue-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-400';
    if (probability >= 60) return 'text-yellow-400';
    if (probability >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const closeLaunchDetails = () => {
    setShowModal(false);
    setSelectedLaunch(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Launch <span className="text-space-gold">Calendar</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Never miss a rocket launch with our comprehensive launch schedule and live updates
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search launches by name or mission..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan appearance-none"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="">All Providers</option>
                {providers.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowUpcoming(!showUpcoming)}
              className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                showUpcoming 
                  ? 'bg-space-cyan text-white' 
                  : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
              }`}
            >
              {showUpcoming ? 'Upcoming' : 'All Launches'}
            </button>
          </div>
        </div>
        
        <button
          onClick={syncUpcomingLaunches}
          className="btn-secondary text-sm"
          disabled={loading}
        >
          Sync Latest Launches
        </button>
      </div>

      {/* Launches Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-space-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading launches...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {launches.map((launch) => (
            <div key={launch._id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
              {launch.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={launch.image} 
                    alt={launch.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">{launch.name}</h3>
                  <p className="text-space-cyan font-medium mb-2">{launch.provider}</p>
                </div>
                {launch.status && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(launch.status.abbrev)}`}>
                    {launch.status.abbrev}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-space-gold" />
                  <div>
                    <p className="text-xs text-gray-400">Launch Date</p>
                    <p className="text-sm">{formatLaunchDate(launch.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-space-purple" />
                  <div>
                    <p className="text-xs text-gray-400">Time Until Launch</p>
                    <p className="text-sm font-medium">{getTimeUntilLaunch(launch.date)}</p>
                  </div>
                </div>

                {launch.vehicle?.name && (
                  <div className="flex items-center space-x-3">
                    <Rocket className="w-4 h-4 text-space-cyan" />
                    <div>
                      <p className="text-xs text-gray-400">Vehicle</p>
                      <p className="text-sm">{launch.vehicle.name}</p>
                    </div>
                  </div>
                )}

                {launch.pad?.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm">{launch.pad.location}</p>
                    </div>
                  </div>
                )}

                {launch.probability !== null && launch.probability !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Launch Probability</span>
                    <span className={`text-sm font-bold ${getProbabilityColor(launch.probability)}`}>
                      {launch.probability}%
                    </span>
                  </div>
                )}
              </div>

              {launch.mission?.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {launch.mission.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  {launch.webcast_live && (
                    <div className="flex items-center space-x-1 text-red-400">
                      <Play className="w-3 h-3" />
                      <span className="text-xs">Live</span>
                    </div>
                  )}
                  {launch.mission?.type && (
                    <span className="text-xs text-gray-400">
                      {launch.mission.type}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setSelectedLaunch(launch);
                  }}
                  className="text-space-gold hover:text-white transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {launches.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No launches found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Launch Details Modal */}
      {showModal && selectedLaunch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedLaunch.name}</h2>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-4 py-2 bg-space-gold/20 text-space-gold rounded-full text-sm font-medium">
                      {selectedLaunch.provider}
                    </div>
                    {selectedLaunch.status && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLaunch.status.abbrev)}`}>
                        {selectedLaunch.status.name}
                      </div>
                    )}
                    {selectedLaunch.webcast_live && (
                      <div className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                        <Play className="w-3 h-3" />
                        <span>Live</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{getTimeUntilLaunch(selectedLaunch.date)}</span>
                  </div>
                </div>
                <button
                  onClick={closeLaunchDetails}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Launch Image */}
              {selectedLaunch.image && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={selectedLaunch.image} 
                    alt={selectedLaunch.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Mission Description */}
              {selectedLaunch.mission?.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Mission Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedLaunch.mission.description}</p>
                </div>
              )}

              {/* Launch Details Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Launch Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Launch Information</h3>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-space-gold" />
                    <div>
                      <p className="text-sm text-gray-400">Launch Date</p>
                      <p className="text-white">{formatLaunchDate(selectedLaunch.date)}</p>
                    </div>
                  </div>

                  {selectedLaunch.probability !== null && selectedLaunch.probability !== undefined && (
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-space-cyan" />
                      <div>
                        <p className="text-sm text-gray-400">Launch Probability</p>
                        <p className={`font-bold ${getProbabilityColor(selectedLaunch.probability)}`}>
                          {selectedLaunch.probability}%
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedLaunch.net_precision && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-space-purple" />
                      <div>
                        <p className="text-sm text-gray-400">Time Precision</p>
                        <p className="text-white">{selectedLaunch.net_precision.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle & Mission */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Vehicle & Mission</h3>
                  
                  {selectedLaunch.vehicle && (
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-5 h-5 text-space-cyan" />
                      <div>
                        <p className="text-sm text-gray-400">Launch Vehicle</p>
                        <p className="text-white">{selectedLaunch.vehicle.name}</p>
                        {selectedLaunch.vehicle.configuration && (
                          <p className="text-xs text-gray-500">{selectedLaunch.vehicle.configuration}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedLaunch.mission?.name && (
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Mission</p>
                        <p className="text-white">{selectedLaunch.mission.name}</p>
                        {selectedLaunch.mission.type && (
                          <p className="text-xs text-gray-500">{selectedLaunch.mission.type}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedLaunch.mission?.orbit && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Target Orbit</p>
                        <p className="text-white">{selectedLaunch.mission.orbit}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location & Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Location & Stats</h3>
                  
                  {selectedLaunch.pad && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Launch Pad</p>
                        <p className="text-white">{selectedLaunch.pad.name}</p>
                        {selectedLaunch.pad.location && (
                          <p className="text-xs text-gray-500">{selectedLaunch.pad.location}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedLaunch.orbital_launch_attempt_count && (
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-5 h-5 text-space-purple" />
                      <div>
                        <p className="text-sm text-gray-400">Orbital Launch #</p>
                        <p className="text-white">#{selectedLaunch.orbital_launch_attempt_count}</p>
                      </div>
                    </div>
                  )}

                  {selectedLaunch.agency_launch_attempt_count && (
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-space-gold" />
                      <div>
                        <p className="text-sm text-gray-400">Agency Launch #</p>
                        <p className="text-white">#{selectedLaunch.agency_launch_attempt_count}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Programs */}
              {selectedLaunch.program && selectedLaunch.program.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Programs</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLaunch.program.map((program, index) => (
                      <div key={index} className="px-3 py-2 bg-space-purple/20 text-space-purple rounded-lg">
                        <p className="text-sm font-medium">{program.name}</p>
                        {program.agencies && program.agencies.length > 0 && (
                          <p className="text-xs text-gray-400">{program.agencies.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Additional Information</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedLaunch.webcast_live && (
                    <button
                      onClick={() => window.open('#', '_blank')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Watch Live</span>
                    </button>
                  )}
                  {selectedLaunch.infographic && (
                    <a
                      href={selectedLaunch.infographic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Infographic</span>
                    </a>
                  )}
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedLaunch.orbital_launch_attempt_count_year && 
                        `${selectedLaunch.orbital_launch_attempt_count_year} launches this year`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Launches;
