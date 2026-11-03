import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Abhi ke liye hum simple placeholders bana rahe hain
// Baad mein hum alag files banayenge
const Home = () => <div style={{ padding: '20px' }}><h1>MediSlot Home (Practo Clone)</h1><p>Yahan search bar aayega.</p></div>;
const Doctors = () => <div style={{ padding: '20px' }}><h1>Doctors List</h1><p>Yahan doctor cards aayenge.</p></div>;

function App() {
  return (
    // Router hamari puri app ko navigation ki power deta hai
    <Router>
      <div className="app-container">
        {/* Navigation / Header yahan aayega */}
        
        <Routes>
          {/* Route define karta hai ki kaunse URL par kaunsa page dikhega */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;