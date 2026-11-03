import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Naya component import kiya
import './index.css';

const Home = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <h2 style={{ fontSize: '32px' }}>Your Home for Health</h2>
    <p style={{ color: '#787887' }}>Find and Book Appointments with Doctors near you.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar yahan daal diya taaki har page pe dikhe */}
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<div>Doctors Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;