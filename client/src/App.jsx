import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCards from './components/ServiceCards';
import Specialties from './components/Specialties';
import Articles from './components/Articles';
import Testimonials from './components/Testimonials';
import DoctorList from './components/DoctorList';
import Bookings from './components/Bookings';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal'; // Import Auth Modal
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
      <Articles />
      <Testimonials />
      <DoctorList 
        searchTerm={searchTerm} 
        selectedCategory={selectedCategory} 
      />
    </div>
  );
};

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('medislot_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medislot_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('medislot_user');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          currentUser={currentUser} 
          onOpenLogin={() => setIsAuthOpen(true)} 
          onLogout={handleLogout} 
        />
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>

        <Footer />

        {/* Auth Modal Popup */}
        {isAuthOpen && (
          <AuthModal 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;