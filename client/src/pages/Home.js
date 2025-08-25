import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Satellite, Calendar, Newspaper, BarChart3, ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Satellite,
      title: 'Live Satellite Tracking',
      description: 'Track ISS and thousands of satellites in real-time with interactive 3D visualization',
      link: '/satellites',
      color: 'from-space-cyan to-blue-400'
    },
    {
      icon: Rocket,
      title: 'Mission Database',
      description: 'Explore past, present, and future space missions from NASA, SpaceX, ISRO, and ESA',
      link: '/missions',
      color: 'from-space-purple to-purple-400'
    },
    {
      icon: Calendar,
      title: 'Launch Calendar',
      description: 'Never miss a rocket launch with our comprehensive launch schedule and notifications',
      link: '/launches',
      color: 'from-space-gold to-yellow-400'
    },
    {
      icon: Newspaper,
      title: 'Space News',
      description: 'Stay updated with the latest space discoveries, research, and breakthrough announcements',
      link: '/news',
      color: 'from-green-400 to-emerald-400'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Satellites Tracked' },
    { number: '500+', label: 'Missions Cataloged' },
    { number: '100+', label: 'Upcoming Launches' },
    { number: '24/7', label: 'Real-time Updates' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-space-cyan via-space-purple to-space-gold bg-clip-text text-transparent">
              OrbitIQ
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
            Your one-stop hub for space exploration, satellite tracking, and mission data
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover the cosmos with real-time satellite tracking, comprehensive mission databases, 
            and stunning 3D visualizations that make space accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/satellites" className="btn-primary inline-flex items-center">
              Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/dashboard" className="btn-secondary inline-flex items-center">
              View Dashboard <BarChart3 className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-space-cyan mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-50">
            Explore the <span className="text-space-cyan">Universe</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From real-time satellite tracking to comprehensive mission data, 
            OrbitIQ brings the cosmos to your fingertips.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="glass-card p-8 hover:scale-105 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-space-cyan transition-colors text-gray-50">
                {feature.title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center text-space-cyan group-hover:translate-x-2 transition-transform">
                Learn More <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20">
        <div className="glass-card p-12 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Star className="w-12 h-12 text-space-gold animate-pulse-slow" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-50">
            Ready to Explore Space?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of space enthusiasts, researchers, and students who use OrbitIQ 
            to stay connected with the cosmos.
          </p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center text-lg">
            Create Your Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
