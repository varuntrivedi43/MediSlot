import React, { useState, useEffect } from 'react';
import './Bookings.css';

const Bookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Bookings from MongoDB
  const fetchMyBookings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings');
      const data = await response.json();
      setMyBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Handle Cancellation
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Refresh the list after deletion
        fetchMyBookings();
        alert("Appointment Cancelled successfully.");
      }
    } catch (err) {
      alert("Failed to cancel appointment.");
    }
  };

  if (loading) return <div className="loading">Loading your appointments...</div>;

  return (
    <div className="bookings-container">
      <h2 className="page-title">My Appointments</h2>
      
      {myBookings.length === 0 ? (
        <div className="no-bookings">
          <p>You have no upcoming appointments.</p>
          <button onClick={() => window.location.href = '/'}>Book Now</button>
        </div>
      ) : (
        <div className="tickets-list">
          {myBookings.map((b) => (
            <div key={b.id} className="digital-ticket">
              <div className="ticket-header">
                <span className="conf-text">CONFIRMED</span>
                <span className="ref-id">ID: {b.id.slice(-6).toUpperCase()}</span>
              </div>
              
              <div className="ticket-body">
                <div className="doctor-section">
                  <h3>{b.doctorName}</h3>
                  <p className="spec">{b.specialty}</p>
                </div>
                
                <div className="timing-section">
                  <div className="info-box">
                    <label>DATE & TIME</label>
                    <p>Today, {b.slot}</p>
                  </div>
                  <div className="info-box">
                    <label>CLINIC</label>
                    <p>{b.clinic}</p>
                  </div>
                </div>

                <div className="patient-section">
                  <label>PATIENT DETAILS</label>
                  <p><strong>{b.patientName}</strong> | {b.patientPhone}</p>
                </div>
              </div>

              <div className="ticket-footer">
                <button className="cancel-link" onClick={() => handleCancel(b.id)}>
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;