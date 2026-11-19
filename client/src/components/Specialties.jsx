import React from 'react';
import { Baby, Thermometer, Brain, Sparkles, HeartPulse, Flower2 } from 'lucide-react'; // Professional Icons
import './Specialties.css';

const concerns = [
  { 
    id: 1, 
    title: 'Period doubts or Pregnancy', 
    icon: <Flower2 size={40} color="#ff69b4" />, 
    bgColor: '#fff0f6',
    link: 'CONSULT NOW' 
  },
  { 
    id: 2, 
    title: 'Acne, pimple or skin issues', 
    icon: <Sparkles size={40} color="#f0ad4e" />, 
    bgColor: '#fff8e1',
    link: 'CONSULT NOW' 
  },
  { 
    id: 3, 
    title: 'Performance issues in bed', 
    icon: <HeartPulse size={40} color="#d9534f" />, 
    bgColor: '#fff5f5',
    link: 'CONSULT NOW' 
  },
  { 
    id: 4, 
    title: 'Cold, cough or fever', 
    icon: <Thermometer size={40} color="#5bc0de" />, 
    bgColor: '#e1f5fe',
    link: 'CONSULT NOW' 
  },
  { 
    id: 5, 
    title: 'Child not feeling well', 
    icon: <Baby size={40} color="#5cb85c" />, 
    bgColor: '#e8f5e9',
    link: 'CONSULT NOW' 
  },
  { 
    id: 6, 
    title: 'Depression or anxiety', 
    icon: <Brain size={40} color="#6f42c1" />, 
    bgColor: '#f3e5f5',
    link: 'CONSULT NOW' 
  },
];

const Specialties = () => {
  return (
    <section className="specialties-section">
      <div className="specialties-header">
        <div className="header-left">
          <h2>Consult top doctors online for any health concern</h2>
          <p>Private online consultations with verified doctors in all specialists</p>
        </div>
        <button className="view-all-btn">View All Specialities</button>
      </div>

      <div className="concerns-grid">
        {concerns.map((item) => (
          <div key={item.id} className="concern-item">
            <div className="circle-icon" style={{ backgroundColor: item.bgColor }}>
              {item.icon}
            </div>
            <p className="concern-title">{item.title}</p>
            <a href="#" className="consult-link">{item.link}</a>
          </div>
        ))}
      </div>
      
      <hr className="section-divider" />

      <div className="specialties-header">
        <div className="header-left">
          <h2 style={{marginTop: '40px'}}>Book an appointment for an in-clinic consultation</h2>
          <p>Find experienced doctors across all specialties</p>
        </div>
      </div>
    </section>
  );
};

export default Specialties;