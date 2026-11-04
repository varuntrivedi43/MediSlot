import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import SlotModal from './SlotModal'; // Modal Import
import './DoctorList.css';

const DoctorList = ({ searchTerm, selectedCategory }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Modal handling
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/doctors');
        if (!response.ok) throw new Error('Backend non-responsive');
        const data = await response.json();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError('Unable to connect to MediSlot server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesCategory = selectedCategory 
      ? doc.specialty.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;

    if (!term) return matchesCategory;

    const matchesSearch = 
      doc.name.toLowerCase().includes(term) ||
      doc.specialty.toLowerCase().includes(term) ||
      doc.clinic.toLowerCase().includes(term) ||
      doc.location.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  // Open Modal on Book Button Click
  const handleBookSlot = (doctor) => {
    setSelectedDoctorForBooking(doctor);
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedDoctorForBooking(null);
  };

  // On Success Booking from Backend
  const handleBookingSuccess = (bookingData) => {
    setConfirmedBooking(bookingData);
    setSelectedDoctorForBooking(null);
  };

  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Searching for top doctors near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error-box">
        <h3>⚠️ Connection Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="doctor-list-container">
      {/* Booking Success Alert */}
      {confirmedBooking && (
        <div className="booking-alert-success">
          🎉 <strong>Appointment Confirmed!</strong> Booking Reference ID: <u>{confirmedBooking._id || confirmedBooking.id}</u> for {confirmedBooking.patientName} with {confirmedBooking.doctorName} on <strong>{confirmedBooking.slot}</strong>.
          <button onClick={() => setConfirmedBooking(null)}>✕</button>
        </div>
      )}

      <div className="results-header">
        <h2>{filteredDoctors.length} Doctors Available</h2>
        <p>Book guaranteed appointments without waiting in line</p>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="no-results">
          <h3>No Doctors Found</h3>
          <p>Try searching for another specialty or clear search filters.</p>
        </div>
      ) : (
        filteredDoctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} onBookSlot={handleBookSlot} />
        ))
      )}

      {/* Render Slot Modal if doctor is selected */}
      {selectedDoctorForBooking && (
        <SlotModal
          doctor={selectedDoctorForBooking}
          onClose={handleCloseModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default DoctorList;