import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
  // 'searchTerm' variable mein hum user ki typing save karenge
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Find and Book Appointments</h1>
        <p>Book appointments with the best doctors in your city</p>
        
        {/* Practo-style Big Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search doctors, clinics, specialties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>

        {/* Quick Links (Filter Pills) */}
        <div className="quick-filters">
          <span>Popular:</span>
          <button className="filter-pill">Dentist</button>
          <button className="filter-pill">Gynecologist</button>
          <button className="filter-pill">General Physician</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;