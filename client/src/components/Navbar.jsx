import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-left">
          <div className="logo" onClick={() => window.location.href = '/'}>
            MediSlot
          </div>
          
          {/* City Selector (Practo Style) */}
          <div className="city-selector">
            <i className="location-icon">📍</i>
            <select className="city-dropdown">
              <option>New Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
            </select>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-right">
          <a href="#" className="nav-link">Find Doctors</a>
          <a href="#" className="nav-link">Video Consult</a>
          <a href="#" className="nav-link">Medicines</a>
          <button className="login-btn">Login / Signup</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;