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
import AuthModal from './components/AuthModal';
import HelpModal from './components/HelpModal';
import './index.css';

/**
 * Home Component
 * Intelligent UX:
 * 1. If searching -> Immediately displays Doctor Cards right below search box.
 * 2. If idle/browsing -> Displays explore cards, articles, and symptoms.
 */
const Home = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Flag: Kya user kuch actively search kar raha hai?
  const isSearchActive = searchTerm.trim().length > 0 || selectedCategory.trim().length > 0;

  return (
    <div>
      <Hero 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* SEARCH IS ACTIVE: Doctors are shown IMMEDIATELY right here */}
      {isSearchActive ? (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px 0', minHeight: '60vh' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              style={{
                background: '#ffffff',
                border: '1px solid #d3d3d3',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#1a2074',
                marginBottom: '10px'
              }}
            >
              ← Back to Explore All Services
            </button>
          </div>
          <DoctorList 
            searchTerm={searchTerm} 
            selectedCategory={selectedCategory} 
            currentUser={currentUser} 
          />
        </div>
      ) : (
        /* IDLE / EXPLORE MODE: Full Practo Landing Experience */
        <>
          <ServiceCards />
          <Specialties />
          <Articles />
          <Testimonials />
          
          {/* Default Doctors preview at the bottom */}
          <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '20px' }}>
            <DoctorList 
              searchTerm="" 
              selectedCategory="" 
              currentUser={currentUser} 
            />
          </div>
        </>
      )}
    </div>
  );
};

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Restore user session on refresh
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
          onOpenHelp={() => setIsHelpOpen(true)}
        />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>

        <Footer onOpenHelp={() => setIsHelpOpen(true)} />

        {/* Modal Dialogs */}
        {isAuthOpen && (
          <AuthModal 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}

        {isHelpOpen && (
          <HelpModal 
            currentUser={currentUser} 
            onClose={() => setIsHelpOpen(false)} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;