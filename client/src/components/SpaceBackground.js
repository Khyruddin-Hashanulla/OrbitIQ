import React, { useEffect, useRef } from 'react';

const SpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Stars array
    const stars = [];
    const numStars = 200;

    // Floating particles array
    const particles = [];
    const numParticles = 50;

    // Nebula points for gradient effect
    const nebulaPoints = [];
    const numNebulaPoints = 8;

    // Planets array
    const planets = [];
    const numPlanets = 3;

    // Satellites array
    const satellites = [];
    const numSatellites = 6;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.8 ? '#06b6d4' : Math.random() > 0.6 ? '#7c3aed' : '#ffffff'
      });
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#06b6d4' : '#7c3aed'
      });
    }

    // Initialize nebula points
    for (let i = 0; i < numNebulaPoints; i++) {
      nebulaPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 100,
        opacity: Math.random() * 0.1 + 0.05,
        color: Math.random() > 0.5 ? '#7c3aed' : '#06b6d4',
        pulseSpeed: Math.random() * 0.01 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Initialize planets
    for (let i = 0; i < numPlanets; i++) {
      const centerX = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
      const centerY = canvas.height * 0.2 + Math.random() * canvas.height * 0.6;
      
      planets.push({
        centerX,
        centerY,
        orbitRadius: Math.random() * 150 + 100,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.001,
        radius: Math.random() * 8 + 4,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)],
        glowIntensity: Math.random() * 0.5 + 0.3
      });
    }

    // Initialize satellites
    for (let i = 0; i < numSatellites; i++) {
      const centerX = canvas.width * 0.1 + Math.random() * canvas.width * 0.8;
      const centerY = canvas.height * 0.1 + Math.random() * canvas.height * 0.8;
      
      satellites.push({
        centerX,
        centerY,
        orbitRadius: Math.random() * 200 + 80,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.005,
        size: Math.random() * 3 + 2,
        trailLength: 15,
        trail: [],
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: Math.random() * 0.05 + 0.02
      });
    }

    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with deep space background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula effects
      nebulaPoints.forEach(nebula => {
        const pulseOpacity = nebula.opacity * (1 + 0.3 * Math.sin(time * nebula.pulseSpeed + nebula.pulsePhase));
        
        const nebulaGradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        
        nebulaGradient.addColorStop(0, `${nebula.color}${Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0')}`);
        nebulaGradient.addColorStop(0.5, `${nebula.color}${Math.floor(pulseOpacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
        nebulaGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(
          nebula.x - nebula.radius,
          nebula.y - nebula.radius,
          nebula.radius * 2,
          nebula.radius * 2
        );
      });

      // Draw and animate planets
      planets.forEach(planet => {
        planet.angle += planet.speed;
        
        const x = planet.centerX + Math.cos(planet.angle) * planet.orbitRadius;
        const y = planet.centerY + Math.sin(planet.angle) * planet.orbitRadius;
        
        // Draw orbit path (faint)
        ctx.beginPath();
        ctx.arc(planet.centerX, planet.centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw planet glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, planet.radius * 3);
        glowGradient.addColorStop(0, `${planet.color}${Math.floor(planet.glowIntensity * 255).toString(16).padStart(2, '0')}`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, planet.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw planet
        ctx.beginPath();
        ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();
        
        // Add planet highlight
        const highlightGradient = ctx.createRadialGradient(
          x - planet.radius * 0.3, y - planet.radius * 0.3, 0,
          x, y, planet.radius
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and animate satellites
      satellites.forEach(satellite => {
        satellite.angle += satellite.speed;
        satellite.blinkPhase += satellite.blinkSpeed;
        
        const x = satellite.centerX + Math.cos(satellite.angle) * satellite.orbitRadius;
        const y = satellite.centerY + Math.sin(satellite.angle) * satellite.orbitRadius;
        
        // Add current position to trail
        satellite.trail.push({ x, y });
        if (satellite.trail.length > satellite.trailLength) {
          satellite.trail.shift();
        }
        
        // Draw orbit path (very faint)
        ctx.beginPath();
        ctx.arc(satellite.centerX, satellite.centerY, satellite.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw satellite trail
        satellite.trail.forEach((point, index) => {
          const opacity = (index / satellite.trail.length) * 0.5;
          ctx.beginPath();
          ctx.arc(point.x, point.y, satellite.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.fill();
        });
        
        // Draw satellite with blinking effect
        const blinkIntensity = 0.7 + 0.3 * Math.sin(satellite.blinkPhase);
        
        // Satellite body
        ctx.beginPath();
        ctx.arc(x, y, satellite.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${blinkIntensity})`;
        ctx.fill();
        
        // Satellite glow
        ctx.beginPath();
        ctx.arc(x, y, satellite.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${blinkIntensity * 0.3})`;
        ctx.fill();
        
        // Draw satellite solar panels (simple rectangles)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(satellite.angle);
        
        // Left panel
        ctx.fillStyle = `rgba(100, 149, 237, ${blinkIntensity * 0.8})`;
        ctx.fillRect(-satellite.size * 3, -satellite.size * 0.5, satellite.size * 1.5, satellite.size);
        
        // Right panel
        ctx.fillRect(satellite.size * 1.5, -satellite.size * 0.5, satellite.size * 1.5, satellite.size);
        
        ctx.restore();
      });

      // Draw and animate stars
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1) star.opacity = 0;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Add star glow effect
        if (star.opacity > 0.7) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${Math.floor((star.opacity - 0.7) * 0.3 * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      });

      // Draw and animate particles
      particles.forEach(particle => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Add particle glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 0.2 * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      // Draw shooting stars occasionally
      if (Math.random() < 0.003) {
        const shootingStar = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 20,
          angle: Math.random() * Math.PI / 4 + Math.PI / 4,
          speed: Math.random() * 5 + 3,
          opacity: 1
        };

        const drawShootingStar = (star) => {
          const endX = star.x + Math.cos(star.angle) * star.length;
          const endY = star.y + Math.sin(star.angle) * star.length;
          
          const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
          gradient.addColorStop(0, `#ffffff${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        };

        drawShootingStar(shootingStar);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default SpaceBackground;
