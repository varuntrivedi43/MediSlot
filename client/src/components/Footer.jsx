import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * Practo-style 6-column deep-blue footer with full navigation and corporate links.
 */
const Footer = () => {
  return (
    <footer className="practo-footer">
      <div className="footer-top-container">
        {/* Column 1: MediSlot Brand Info */}
        <div className="footer-col">
          <h4>MediSlot</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 2: For Patients */}
        <div className="footer-col">
          <h4>For patients</h4>
          <ul>
            <li><a href="/">Search for doctors</a></li>
            <li><a href="/">Search for clinics</a></li>
            <li><a href="/">Search for hospitals</a></li>
            <li><a href="/">Surgery Costs</a></li>
            <li><a href="/">Book Diagnostic Tests</a></li>
            <li><a href="/">MediSlot Plus</a></li>
            <li><a href="/">Read health articles</a></li>
            <li><a href="/bookings">My Appointments</a></li>
          </ul>
        </div>

        {/* Column 3: For Doctors */}
        <div className="footer-col">
          <h4>For doctors</h4>
          <ul>
            <li><a href="#doctor-profile">MediSlot Profile</a></li>
          </ul>

          <h4 className="sub-heading">For clinics</h4>
          <ul>
            <li><a href="#clinic-ray">Ray by MediSlot</a></li>
            <li><a href="#clinic-reach">MediSlot Reach</a></li>
            <li><a href="#clinic-tab">MediSlot Tab</a></li>
            <li><a href="#clinic-pro">MediSlot Pro</a></li>
          </ul>
        </div>

        {/* Column 4: For Hospitals */}
        <div className="footer-col">
          <h4>For hospitals</h4>
          <ul>
            <li><a href="#hospital-insta">Insta by MediSlot</a></li>
            <li><a href="#hospital-qikwell">Qikwell by MediSlot</a></li>
            <li><a href="#hospital-profile">MediSlot Profile</a></li>
            <li><a href="#hospital-reach">MediSlot Reach</a></li>
          </ul>

          <h4 className="sub-heading">For Corporates</h4>
          <ul>
            <li><a href="#wellness">Wellness Plans</a></li>
          </ul>
        </div>

        {/* Column 5: More & Help */}
        <div className="footer-col">
          <h4>More</h4>
          <ul>
            <li><a href="#help">Help</a></li>
            <li><a href="#developers">Developers</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#directory">Healthcare Directory</a></li>
          </ul>
        </div>

        {/* Column 6: Social Links */}
        <div className="footer-col">
          <h4>Social</h4>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noreferrer">Youtube</a></li>
            <li><a href="https://github.com/varuntrivedi43/MediSlot" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright and Brand Logo */}
      <div className="footer-bottom">
        <div className="footer-brand-logo">
          <span className="dot">•</span>MediSlot<span className="dot">•</span>
        </div>
        <p className="copyright-text">
          Copyright © {new Date().getFullYear()}, MediSlot Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;