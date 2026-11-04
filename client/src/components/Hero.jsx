import React from 'react';
import './Hero.css';

const Hero = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const popularSpecialties = ['Dentist', 'Gynecologist', 'General Physician'];

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Find and Book Appointments</h1>
        <p>Book appointments with the best doctors in your city</p>
        
        {/* Search Bar Input */}
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search doctors, clinics, specialties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>✕</button>
            )}
            <button className="search-btn">Search</button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="quick-filters">
          <span>Popular:</span>
          {popularSpecialties.map((spec) => (
            <button 
              key={spec}
              className={`filter-pill ${selectedCategory === spec ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === spec ? '' : spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;