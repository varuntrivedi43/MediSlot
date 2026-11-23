import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
 * Automatically switches to COMPACT search mode when typing,
 * putting the doctor card directly in view!
 */
const Home = ({ currentUser, activeNavCategory, onClearNavCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sync category if clicked from Navbar (e.g., Video Consult, Lab Tests)
  useEffect(() => {
    if (activeNavCategory) {
      setSelectedCategory(activeNavCategory);
    }
  }, [activeNavCategory]);

  const isSearchActive = searchTerm.trim().length > 0 || selectedCategory.trim().length > 0;

  const handleResetSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    if (onClearNavCategory) onClearNavCategory();
  };

  return (
    <div>
      {/* Hero section: Becomes compact when searching */}
      <Hero 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isCompact={isSearchActive}
      />

      {isSearchActive ? (
        /* SEARCH ACTIVE: Doctor list is right at the top */
        <div style={{ backgroundColor: '#f8f9fa', padding: '16px 0', minHeight: '60vh' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
            <button 
              type="button"
              onClick={handleResetSearch}
              style={{
                background: '#ffffff',
                border: '1px solid #c9cce8',
                padding: '6px 14px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#1a2074',
                fontSize: '13px',
                marginBottom: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
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
        /* IDLE MODE: Full Practo Marketing Landing */
        <>
          <ServiceCards />
          <Specialties />
          <Articles />
          <Testimonials />
          
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
  const [activeNavCategory, setActiveNavCategory] = useState('');

  // Persist user session from localStorage
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

  const handleLoginSuccess = (user) => setCurrentUser(user);
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
          onSelectNavCategory={(cat) => setActiveNavCategory(cat)}
        />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  currentUser={currentUser} 
                  activeNavCategory={activeNavCategory}
                  onClearNavCategory={() => setActiveNavCategory('')}
                />
              } 
            />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>

        <Footer onOpenHelp={() => setIsHelpOpen(true)} />

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