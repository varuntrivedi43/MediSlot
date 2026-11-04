import React, { useState } from 'react';
import './SlotModal.css';

/**
 * SlotModal Component
 * Doctor slot booking interface modal pop-up.
 */
const SlotModal = ({ doctor, onClose, onBookingSuccess }) => {
  // Booking Form States
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Form Submit (POST request to Express API -> MongoDB Atlas)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select a time slot.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Send payload to backend `/api/bookings`
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          clinic: doctor.clinic,
          slot: selectedSlot,
          patientName: patientName,
          patientPhone: patientPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Slot already booked or invalid payload');
      }

      // Success Callback
      onBookingSuccess(data.booking);
    } catch (err) {
      console.error('Booking failed:', err);
      setErrorMsg(err.message || 'Failed to book slot. Try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2>Book Appointment</h2>
            <p className="sub-header">{doctor.name} • {doctor.specialty}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Doctor Summary Bar */}
        <div className="doctor-summary-bar">
          <div>
            <small>Consultation Fee</small>
            <div className="summary-fee">₹{doctor.fee}</div>
          </div>
          <div>
            <small>Clinic Location</small>
            <div className="summary-clinic">{doctor.clinic}, {doctor.location}</div>
          </div>
        </div>

        {errorMsg && <div className="modal-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Slot Selection Pills */}
          <div className="form-group">
            <label>Select Available Time Slot:</label>
            <div className="slot-grid">
              {doctor.slots && doctor.slots.length > 0 ? (
                doctor.slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`slot-pill ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>No slots available today.</p>
              )}
            </div>
          </div>

          {/* Patient Details Input */}
          <div className="form-group">
            <label>Patient Full Name:</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Sharma"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number:</label>
            <input 
              type="tel" 
              placeholder="10-digit mobile number"
              required
              pattern="[0-9]{10}"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="confirm-booking-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming with Hospital...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SlotModal;