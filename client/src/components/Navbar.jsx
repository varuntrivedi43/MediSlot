import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Complete Practo Navbar
 * Links:
 * 1. Find Doctors (/)
 * 2. Video Consult (?category=General Physician)
 * 3. Lab Tests (?category=Diagnostic)
 * 4. Surgeries (?category=Surgery)
 * 5. My Appointments (/bookings)
 * Fully responsive with Mobile Hamburger Drawer
 */
const Navbar = ({ currentUser, onOpenLogin, onLogout, onOpenHelp, onSelectNavCategory }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleServiceClick = (category) => {
    closeDrawer();
    if (onSelectNavCategory) {
      onSelectNavCategory(category);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Left: Hamburger (Mobile) + Logo + Practo Links */}
          <div className="nav-left">
            <button className="hamburger-btn" onClick={toggleDrawer} aria-label="Open Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <Link to="/" className="logo" onClick={() => handleServiceClick('')}>
              <span className="logo-dot">•</span>MediSlot<span className="logo-dot">•</span>
            </Link>

            {/* Complete Desktop Nav Links */}
            <div className="nav-primary-links">
              <NavLink 
                to="/" 
                end 
                onClick={() => handleServiceClick('')}
                className={({ isActive }) => isActive ? 'nav-primary-item active' : 'nav-primary-item'}
              >
                Find Doctors
              </NavLink>

              <button 
                type="button" 
                className="nav-link-btn" 
                onClick={() => handleServiceClick('General Physician')}
              >
                Video Consult
              </button>

              <button 
                type="button" 
                className="nav-link-btn" 
                onClick={() => handleServiceClick('Diagnostic')}
              >
                Lab Tests
              </button>

              <button 
                type="button" 
                className="nav-link-btn" 
                onClick={() => handleServiceClick('Surgeon')}
              >
                Surgeries
              </button>
              
              <NavLink 
                to="/bookings" 
                className={({ isActive }) => isActive ? 'nav-primary-item active' : 'nav-primary-item'}
              >
                My Appointments
              </NavLink>
            </div>
          </div>

          {/* Right: Security & Login */}
          <div className="nav-right">
            <div className="nav-secondary-item" onClick={onOpenHelp}>
              <span>Security & help</span>
              <span className="dropdown-arrow">▾</span>
            </div>

            {currentUser ? (
              <div className="user-profile-menu">
                <span className="user-greeting">👋 Hi, <strong>{currentUser.name}</strong></span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </div>
            ) : (
              <button className="login-btn" onClick={onOpenLogin}>
                Login / Signup
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && <div className="drawer-backdrop" onClick={closeDrawer}></div>}

      {/* Mobile Side Drawer */}
      <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            <span className="logo-dot">•</span>MediSlot<span className="logo-dot">•</span>
          </div>
          <button className="drawer-close-btn" onClick={closeDrawer}>✕</button>
        </div>

        {currentUser && (
          <div className="drawer-user-info">
            <p>Signed in as:</p>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.phone}</small>
          </div>
        )}

        <ul className="drawer-links">
          <li>
            <NavLink to="/" end onClick={() => handleServiceClick('')} className="drawer-link">
              🔍 Find Doctors
            </NavLink>
          </li>
          <li>
            <button className="drawer-link-btn" onClick={() => handleServiceClick('General Physician')}>
              📹 Video Consult
            </button>
          </li>
          <li>
            <button className="drawer-link-btn" onClick={() => handleServiceClick('Diagnostic')}>
              🔬 Lab Tests
            </button>
          </li>
          <li>
            <button className="drawer-link-btn" onClick={() => handleServiceClick('Surgeon')}>
              🏥 Surgeries
            </button>
          </li>
          <li>
            <NavLink to="/bookings" onClick={closeDrawer} className="drawer-link">
              📅 My Appointments
            </NavLink>
          </li>
          <li>
            <button className="drawer-link-btn" onClick={() => { closeDrawer(); onOpenHelp(); }}>
              🛡️ Security & Help
            </button>
          </li>
        </ul>

        <div className="drawer-footer">
          {currentUser ? (
            <button className="drawer-logout-btn" onClick={() => { closeDrawer(); onLogout(); }}>
              Logout
            </button>
          ) : (
            <button className="drawer-login-btn" onClick={() => { closeDrawer(); onOpenLogin(); }}>
              Login / Signup
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;