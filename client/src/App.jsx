import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero'; // Naya import
import './index.css';

// Home component ab Hero dikhayega
const Home = () => (
  <div>
    <Hero />
    {/* Baad mein yahan Doctors ki list aayegi */}
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
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