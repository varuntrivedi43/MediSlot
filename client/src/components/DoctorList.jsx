import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

const DoctorList = ({ searchTerm, selectedCategory }) => {
  // State 1: Doctors array stored from server
  const [doctors, setDoctors] = useState([]);
  // State 2: Loading indicator while fetching from API
  const [loading, setLoading] = useState(true);
  // State 3: Outage / Error state handling
  const [error, setError] = useState(null);

  // Component load hote hi backend se data fetch hoga
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Express Backend Endpoint
        const response = await fetch('http://localhost:3000/api/doctors');
        
        if (!response.ok) {
          throw new Error('Backend server non-responsive');
        }

        const data = await response.json();
        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Unable to connect to MediSlot server. Please check backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Smart Search Filtering Logic (Tokenized matching across Name, Specialty, Clinic, Location)
  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase().trim();
    
    // Check if category pill was selected
    const matchesCategory = selectedCategory 
      ? doc.specialty.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;

    if (!term) return matchesCategory;

    // Tokenized Search Match
    const matchesSearch = 
      doc.name.toLowerCase().includes(term) ||
      doc.specialty.toLowerCase().includes(term) ||
      doc.clinic.toLowerCase().includes(term) ||
      doc.location.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const handleBookSlot = (doctor) => {
    alert(`Booking Slot for ${doctor.name}. Next step will open slot selection!`);
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
        <small>Make sure Node backend server (`server/index.js`) is running on port 3000.</small>
      </div>
    );
  }

  return (
    <div className="doctor-list-container">
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
    </div>
  );
};

export default DoctorList;