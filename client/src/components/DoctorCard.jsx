import React from 'react';
import './DoctorCard.css';

/**
 * DoctorCard Component
 * Single doctor ki information display karta hai Practo-grade layout mein.
 */
const DoctorCard = ({ doctor, onBookSlot }) => {
  return (
    <div className="doctor-card">
      {/* Left Column: Doctor Profile Avatar */}
      <div className="doctor-avatar-container">
        <div className="doctor-avatar">
          {/* Avatar SVG / Initial Placeholder */}
          <span className="avatar-initial">{doctor.name.replace('Dr. ', '')[0]}</span>
        </div>
        <span className="verified-badge">✓ Verified</span>
      </div>

      {/* Middle Column: Doctor Details */}
      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <p className="doctor-details">
          <span>{doctor.qualification}</span> • <span>{doctor.experience} experience</span>
        </p>
        <p className="doctor-clinic">
          📍 <strong>{doctor.clinic}</strong>, {doctor.location}
        </p>

        {/* Rating and Reviews */}
        <div className="doctor-rating-row">
          <span className="rating-badge">★ {doctor.rating}</span>
          <span className="reviews-count">{doctor.reviewsCount} Patient Stories</span>
        </div>
      </div>

      {/* Right Column: Fees and Slot Booking Action */}
      <div className="doctor-action-box">
        <div className="fee-container">
          <span className="fee-label">Consultation Fee</span>
          <span className="fee-amount">₹{doctor.fee}</span>
        </div>
        
        <button 
          className="book-btn"
          onClick={() => onBookSlot(doctor)}
        >
          Book Appointment
        </button>
        <span className="availability-text">⚡ Available Today</span>
      </div>
    </div>
  );
};

export default DoctorCard;