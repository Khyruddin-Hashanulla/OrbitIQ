import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Users, Target, ExternalLink, Search, Filter, X, Globe, Clock } from 'lucide-react';
import axios from 'axios';

// Configure axios base URL - Fix for development and deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log('API Base URL:', API_BASE_URL);

const Missions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const agencies = ['NASA', 'SpaceX', 'ISRO', 'ESA', 'CNSA', 'Roscosmos', 'JAXA', 'Other'];
  const statuses = ['Planned', 'Active', 'Completed', 'Failed', 'Cancelled'];

  const fetchMissions = async () => {
    try {
      const params = {
        page: 1,
        limit: 12,
        ...(selectedAgency && { agency: selectedAgency }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(searchTerm && { search: searchTerm })
      };
      
      console.log('Fetching missions with params:', params);
      
      const response = await axios.get(`${API_BASE_URL}/api/missions`, { params });
      console.log('Missions response:', response.data);
      setMissions(response.data.missions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching missions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [selectedAgency, selectedStatus, searchTerm]);

  const syncSpaceXMissions = async () => {
    try {
      setLoading(true);
      console.log('Initiating SpaceX sync...');
      const response = await axios.get(`${API_BASE_URL}/api/missions/spacex/sync`);
      console.log('SpaceX sync response:', response.data);
      fetchMissions();
    } catch (error) {
      console.error('Error syncing SpaceX missions:', error);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planned': 'bg-blue-500/20 text-blue-400',
      'Active': 'bg-green-500/20 text-green-400',
      'Completed': 'bg-emerald-500/20 text-emerald-400',
      'Failed': 'bg-red-500/20 text-red-400',
      'Cancelled': 'bg-gray-500/20 text-gray-400'
    };
    return colors[status] || colors['Planned'];
  };

  const getAgencyColor = (agency) => {
    const colors = {
      'NASA': 'from-blue-600 to-blue-400',
      'SpaceX': 'from-gray-800 to-gray-600',
      'ISRO': 'from-orange-600 to-orange-400',
      'ESA': 'from-blue-800 to-blue-600',
      'CNSA': 'from-red-600 to-red-400',
      'Roscosmos': 'from-green-600 to-green-400',
      'JAXA': 'from-purple-600 to-purple-400',
      'Other': 'from-gray-600 to-gray-400'
    };
    return colors[agency] || colors['Other'];
  };

  const openMissionDetails = (mission) => {
    setSelectedMission(mission);
    setShowModal(true);
  };

  const closeMissionDetails = () => {
    setSelectedMission(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Space <span className="text-space-purple">Missions</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Explore past, present, and future space missions from agencies around the world
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search missions by name, description, or destination..."
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
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
              >
                <option value="">All Agencies</option>
                {agencies.map(agency => (
                  <option key={agency} value={agency}>{agency}</option>
                ))}
              </select>
            </div>
            <select
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-space-cyan appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={syncSpaceXMissions}
          className="btn-secondary text-sm"
          disabled={loading}
        >
          Sync SpaceX Missions
        </button>
      </div>

      {/* Missions Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-space-purple border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading missions...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <div key={mission._id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">{mission.name}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getAgencyColor(mission.agency)} mb-2`}>
                    {mission.agency}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status}
                </div>
              </div>

              {mission.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {mission.description}
                </p>
              )}

              <div className="space-y-3 mb-4">
                {mission.launchDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-space-cyan" />
                    <div>
                      <p className="text-xs text-gray-400">Launch Date</p>
                      <p className="text-sm">{formatDate(mission.launchDate)}</p>
                    </div>
                  </div>
                )}

                {mission.type && (
                  <div className="flex items-center space-x-3">
                    <Rocket className="w-4 h-4 text-space-purple" />
                    <div>
                      <p className="text-xs text-gray-400">Mission Type</p>
                      <p className="text-sm">{mission.type}</p>
                    </div>
                  </div>
                )}

                {mission.crew && mission.crew.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-space-gold" />
                    <div>
                      <p className="text-xs text-gray-400">Crew Size</p>
                      <p className="text-sm">{mission.crew.length} members</p>
                    </div>
                  </div>
                )}

                {mission.destination && (
                  <div className="flex items-center space-x-3">
                    <Target className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-gray-400">Destination</p>
                      <p className="text-sm">{mission.destination}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                {mission.vehicle?.name && (
                  <span className="text-xs text-gray-400">
                    Vehicle: {mission.vehicle.name}
                  </span>
                )}
                <div className="flex space-x-2">
                  {mission.links?.wikipedia && (
                    <a
                      href={mission.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-space-cyan hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openMissionDetails(mission)}
                    className="text-space-cyan hover:text-white transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {missions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No missions found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Mission Details Modal */}
      {showModal && selectedMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedMission.name}</h2>
                  <div className="flex items-center gap-3">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getAgencyColor(selectedMission.agency)}`}>
                      {selectedMission.agency}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMission.status)}`}>
                      {selectedMission.status}
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeMissionDetails}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mission Description */}
              {selectedMission.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Mission Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedMission.description}</p>
                </div>
              )}

              {/* Mission Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Launch Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Launch Information</h3>
                  
                  {selectedMission.launchDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-space-cyan" />
                      <div>
                        <p className="text-sm text-gray-400">Launch Date</p>
                        <p className="text-white">{formatDate(selectedMission.launchDate)}</p>
                      </div>
                    </div>
                  )}

                  {selectedMission.type && (
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-5 h-5 text-space-purple" />
                      <div>
                        <p className="text-sm text-gray-400">Mission Type</p>
                        <p className="text-white">{selectedMission.type}</p>
                      </div>
                    </div>
                  )}

                  {selectedMission.destination && (
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Destination</p>
                        <p className="text-white">{selectedMission.destination}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vehicle & Crew Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Vehicle & Crew</h3>
                  
                  {selectedMission.vehicle && (
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-5 h-5 text-space-gold" />
                      <div>
                        <p className="text-sm text-gray-400">Launch Vehicle</p>
                        <p className="text-white">{selectedMission.vehicle.name}</p>
                        {selectedMission.vehicle.manufacturer && (
                          <p className="text-xs text-gray-500">by {selectedMission.vehicle.manufacturer}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedMission.crew && selectedMission.crew.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-space-gold mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Crew Members ({selectedMission.crew.length})</p>
                        <div className="space-y-1">
                          {selectedMission.crew.map((member, index) => (
                            <p key={index} className="text-white text-sm">{member}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* External Links */}
              {(selectedMission.links?.official || selectedMission.links?.wikipedia || selectedMission.links?.video) && (
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">External Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedMission.links?.official && (
                      <a
                        href={selectedMission.links.official}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-space-cyan/20 text-space-cyan rounded-lg hover:bg-space-cyan/30 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Official Site</span>
                      </a>
                    )}
                    {selectedMission.links?.wikipedia && (
                      <a
                        href={selectedMission.links.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Wikipedia</span>
                      </a>
                    )}
                    {selectedMission.links?.video && (
                      <a
                        href={selectedMission.links.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Watch Video</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Missions;
