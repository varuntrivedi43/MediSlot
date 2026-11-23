import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar Component (Complete & Production Ready)
 * Features:
 * 1. Mobile Hamburger Side Drawer
 * 2. Proper Active Link Underline (No permanent hover bug)
 * 3. User Login/Logout Session Display
 * 4. Help & Support Modal Trigger
 */
const Navbar = ({ currentUser, onOpenLogin, onLogout, onOpenHelp }) => {
  // Mobile drawer open/close state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          
          {/* Left Side: Mobile Hamburger + Logo + Links */}
          <div className="nav-left">
            {/* Mobile Hamburger Button */}
            <button className="hamburger-btn" onClick={toggleDrawer} aria-label="Toggle navigation">
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Brand Logo */}
            <Link to="/" className="logo">
              <span className="logo-dot">•</span>MediSlot<span className="logo-dot">•</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="nav-primary-links">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => isActive ? 'nav-primary-item active' : 'nav-primary-item'}
              >
                Find Doctors
              </NavLink>
              
              <NavLink 
                to="/bookings" 
                className={({ isActive }) => isActive ? 'nav-primary-item active' : 'nav-primary-item'}
              >
                My Appointments
              </NavLink>
            </div>
          </div>

          {/* Right Side: Security Help & User Auth */}
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

      {/* Mobile Drawer Backdrop (Clicking outside closes drawer) */}
      {isDrawerOpen && (
        <div className="drawer-backdrop" onClick={closeDrawer}></div>
      )}

      {/* Mobile Slide-in Drawer */}
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
            <NavLink 
              to="/" 
              end 
              onClick={closeDrawer} 
              className={({ isActive }) => isActive ? 'drawer-link active' : 'drawer-link'}
            >
              🔍 Find Doctors
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/bookings" 
              onClick={closeDrawer} 
              className={({ isActive }) => isActive ? 'drawer-link active' : 'drawer-link'}
            >
              📅 My Appointments
            </NavLink>
          </li>
          <li>
            <button 
              className="drawer-action-btn" 
              onClick={() => { closeDrawer(); onOpenHelp(); }}
            >
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