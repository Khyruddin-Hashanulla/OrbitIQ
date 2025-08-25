import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SpaceBackground from './components/SpaceBackground';
import Home from './pages/Home';
import Satellites from './pages/Satellites';
import Missions from './pages/Missions';
import Launches from './pages/Launches';
import News from './pages/News';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent relative">
        <SpaceBackground />
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/satellites" element={<Satellites />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/launches" element={<Launches />} />
              <Route path="/news" element={<News />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
