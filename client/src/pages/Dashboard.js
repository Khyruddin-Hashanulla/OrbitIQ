import React, { useState, useEffect } from 'react';
import { BarChart3, Satellite, Rocket, Calendar, TrendingUp, Activity, MapPin, Clock } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    satellites: { total: 0, active: 0 },
    missions: { total: 0, active: 0, completed: 0 },
    launches: { total: 0, upcoming: 0, thisYear: 0 },
    recentActivity: []
  });
  const [issPosition, setIssPosition] = useState(null);
  const [upcomingLaunches, setUpcomingLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchISSPosition();
    fetchUpcomingLaunches();
    
    // Update ISS position every 10 seconds
    const interval = setInterval(fetchISSPosition, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [satellitesRes, missionsRes, launchesRes] = await Promise.all([
        axios.get('/api/satellites?limit=1'),
        axios.get('/api/missions/stats/overview'),
        axios.get('/api/launches/stats/overview')
      ]);

      const missionsOverview = missionsRes?.data?.overview || {};
      const launchesOverview = launchesRes?.data?.overview || {};

      setDashboardData({
        satellites: {
          total: satellitesRes.data.total || 0,
          active: satellitesRes.data.satellites?.filter(s => s.status === 'Active').length || 0
        },
        missions: {
          total: missionsOverview.totalMissions || 0,
          active: missionsOverview.activeMissions || 0,
          completed: missionsOverview.completedMissions || 0
        },
        launches: {
          total: launchesOverview.total || 0,
          upcoming: launchesOverview.upcoming || 0,
          thisYear: launchesOverview.thisYear || 0
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchISSPosition = async () => {
    try {
      const response = await axios.get('/api/satellites/iss/position');
      setIssPosition(response.data);
    } catch (error) {
      console.error('Error fetching ISS position:', error);
    }
  };

  const fetchUpcomingLaunches = async () => {
    try {
      const response = await axios.get('/api/launches/upcoming/next?limit=5');
      setUpcomingLaunches(response.data);
    } catch (error) {
      console.error('Error fetching upcoming launches:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Mission <span className="text-space-cyan">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Your personalized space exploration command center
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Satellite}
          title="Satellites Tracked"
          value={dashboardData.satellites.total.toLocaleString()}
          subtitle={`${dashboardData.satellites.active} active`}
          color="from-space-cyan to-blue-400"
          trend="+12%"
        />
        <StatCard
          icon={Rocket}
          title="Space Missions"
          value={dashboardData.missions.total.toLocaleString()}
          subtitle={`${dashboardData.missions.active} active`}
          color="from-space-purple to-purple-400"
          trend="+8%"
        />
        <StatCard
          icon={Calendar}
          title="Launches This Year"
          value={dashboardData.launches.thisYear.toLocaleString()}
          subtitle={`${dashboardData.launches.upcoming} upcoming`}
          color="from-space-gold to-yellow-400"
          trend="+15%"
        />
        <StatCard
          icon={Activity}
          title="Mission Success Rate"
          value="94.2%"
          subtitle="Last 12 months"
          color="from-green-500 to-emerald-400"
          trend="+2.1%"
        />
      </div>

      {/* ISS Live Tracker */}
      {issPosition && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">International Space Station</h2>
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE TRACKING</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-space-cyan" />
              <div>
                <p className="text-sm text-gray-400">Current Position</p>
                <p className="font-mono text-lg">
                  {issPosition.position.latitude !== null && issPosition.position.latitude !== undefined 
                    ? `${issPosition.position.latitude.toFixed(4)}°, ${issPosition.position.longitude.toFixed(4)}°`
                    : 'Loading...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-space-purple" />
              <div>
                <p className="text-sm text-gray-400">Altitude</p>
                <p className="font-mono text-lg">
                  {issPosition.position.altitude !== null && issPosition.position.altitude !== undefined 
                    ? `${issPosition.position.altitude.toFixed(1)} km`
                    : '408 km'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-space-gold" />
              <div>
                <p className="text-sm text-gray-400">Velocity</p>
                <p className="font-mono text-lg">
                  {issPosition.position.velocity !== null && issPosition.position.velocity !== undefined 
                    ? `${issPosition.position.velocity.toFixed(1)} km/h`
                    : '27600 km/h'}
                  {issPosition.position.velocitySource && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({issPosition.position.velocitySource === 'API' ? 'Live' : 
                        issPosition.position.velocitySource === 'CALCULATED' ? 'Calc' : 'Sim'})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Last Update</p>
                <p className="text-sm">{formatDate(issPosition.position.timestamp)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Upcoming Launches */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-space-cyan to-blue-400 rounded-lg hover:scale-105 transition-all duration-300">
              <Satellite className="w-6 h-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Track Satellites</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-space-purple to-purple-400 rounded-lg hover:scale-105 transition-all duration-300">
              <Rocket className="w-6 h-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Browse Missions</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-space-gold to-yellow-400 rounded-lg hover:scale-105 transition-all duration-300">
              <Calendar className="w-6 h-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Launch Calendar</p>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg hover:scale-105 transition-all duration-300">
              <BarChart3 className="w-6 h-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">View Analytics</p>
            </button>
          </div>
        </div>

        {/* Upcoming Launches */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6">Upcoming Launches</h2>
          <div className="space-y-4">
            {upcomingLaunches.slice(0, 4).map((launch, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 bg-space-gold rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{launch.name}</h4>
                  <p className="text-sm text-gray-400">{launch.provider}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-space-cyan">{formatDate(launch.date)}</p>
                  <p className="text-xs text-gray-400">{launch.pad?.location}</p>
                </div>
              </div>
            ))}
            {upcomingLaunches.length === 0 && (
              <p className="text-gray-400 text-center py-4">No upcoming launches available</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-6">Recent Space Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-space-cyan to-blue-400 rounded-full flex items-center justify-center">
              <Satellite className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white">ISS position updated</p>
              <p className="text-sm text-gray-400">Real-time tracking data received</p>
            </div>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-space-purple to-purple-400 rounded-full flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white">New SpaceX mission added</p>
              <p className="text-sm text-gray-400">Starship IFT-4 mission details updated</p>
            </div>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-space-gold to-yellow-400 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white">Launch schedule updated</p>
              <p className="text-sm text-gray-400">50 new launches synchronized</p>
            </div>
            <span className="text-xs text-gray-400">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
