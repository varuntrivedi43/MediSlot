import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onOpenLogin }) => {
  const [selectedCity, setSelectedCity] = useState('New Delhi');

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left: Brand Logo & Main Nav Links */}
        <div className="nav-left">
          <div className="logo" onClick={() => window.location.href = '/'}>
            <span className="logo-dot">•</span>MediSlot<span className="logo-dot">•</span>
          </div>

          <div className="nav-primary-links">
            <a href="/" className="nav-primary-item active">Find Doctors</a>
            <a href="#video-consult" className="nav-primary-item">Video Consult</a>
            <a href="#lab-tests" className="nav-primary-item">Lab Tests</a>
            <a href="#surgeries" className="nav-primary-item">Surgeries</a>
            <a href="/bookings" className="nav-primary-item">My Appointments</a>
          </div>
        </div>

        {/* Right: Dropdowns & Auth */}
        <div className="nav-right">
          <div className="nav-secondary-item">
            <span className="badge-new">NEW</span>
            <span>For Corporates</span>
            <span className="dropdown-arrow">▾</span>
          </div>

          <div className="nav-secondary-item">
            <span>For Providers</span>
            <span className="dropdown-arrow">▾</span>
          </div>

          <div className="nav-secondary-item">
            <span>Security & help</span>
            <span className="dropdown-arrow">▾</span>
          </div>

          <button className="login-btn" onClick={onOpenLogin}>
            Login / Signup
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;