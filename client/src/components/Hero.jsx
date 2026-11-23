import React from 'react';
import './Hero.css';

/**
 * Hero Component
 * Supports:
 * - Full hero banner when idle
 * - Compact bar when user is actively searching
 * - Clean borderless clear (X) icon
 */
const Hero = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, isCompact }) => {
  const popularSpecialties = ['Dentist', 'Gynecologist', 'General Physician', 'Cardiologist'];

  return (
    <div className={`hero-section ${isCompact ? 'compact' : ''}`}>
      <div className="hero-content">
        {!isCompact && (
          <>
            <h1>Find and Book Appointments</h1>
            <p>Book appointments with the best verified doctors in your city</p>
          </>
        )}

        {/* Clean Practo Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search doctors by name, specialty, or clinic..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Modern Clean Clear Icon (No ugly borders) */}
            {searchTerm && (
              <button 
                type="button" 
                className="clear-icon-btn" 
                onClick={() => setSearchTerm('')} 
                aria-label="Clear search"
              >
                ✕
              </button>
            )}

            <button className="search-btn">Search</button>
          </div>
        </div>

        {/* Filter Pills (Hidden in compact search view to save vertical space) */}
        {!isCompact && (
          <div className="quick-filters">
            <span className="popular-label">Popular:</span>
            {popularSpecialties.map((spec) => (
              <button 
                key={spec}
                type="button"
                className={`filter-pill ${selectedCategory.toLowerCase() === spec.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory.toLowerCase() === spec.toLowerCase() ? '' : spec)}
              >
                {spec}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;