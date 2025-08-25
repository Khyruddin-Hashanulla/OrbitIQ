import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Satellite, Globe, Calendar, Newspaper, BarChart3, Menu, X } from 'lucide-react';
import logo from '../assets/Logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Home', icon: Globe },
    { path: '/satellites', name: 'Satellites', icon: Satellite },
    { path: '/missions', name: 'Missions', icon: Rocket },
    { path: '/launches', name: 'Launches', icon: Calendar },
    { path: '/news', name: 'News', icon: Newspaper },
    { path: '/dashboard', name: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="glass-card m-4 p-4 relative z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={logo} 
            alt="OrbitIQ Logo" 
            className="w-16 h-16 object-contain"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-space-cyan to-space-purple bg-clip-text text-transparent">
            OrbitIQ
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map(({ path, name, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === path
                  ? 'bg-space-purple/20 text-space-cyan'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          <div className="flex flex-col space-y-2">
            {navItems.map(({ path, name, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-space-purple/20 text-space-cyan'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
