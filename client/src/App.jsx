import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DoctorList from './components/DoctorList';
import Bookings from './components/Bookings';
import Footer from './components/Footer'; // Naya Footer Component Import
import ServiceCards from './components/ServiceCards';
import Specialties from './components/Specialties';
import Articles from './components/Articles'; // Import 1
import Testimonials from './components/Testimonials'; // Import 2
import './index.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div>
      <Hero 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      <ServiceCards />
      <Specialties />

      {/* Screenshot 3: Articles Section */}
      <Articles />

      {/* Screenshot 4: User Reviews */}
      <Testimonials />

      <DoctorList 
        searchTerm={searchTerm} 
        selectedCategory={selectedCategory} 
      />
    </div>
  );
};

function App() {
  const handleOpenLogin = () => {
    alert("Login / Signup system will open here!");
  };

  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar onOpenLogin={handleOpenLogin} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>
        {/* Deep Blue Practo Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;