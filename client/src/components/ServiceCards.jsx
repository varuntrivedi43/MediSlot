import React from 'react';
import './ServiceCards.css';

const services = [
  {
    title: 'Instant Video Consultation',
    desc: 'Connect within 60 secs',
    color: '#afdbf5',
    img: '👨‍⚕️'
  },
  {
    title: 'Find Doctors Near You',
    desc: 'Confirmed appointments',
    color: '#98e9d5',
    img: '👩‍⚕️'
  },
  {
    title: 'Lab Tests',
    desc: 'Safe and trusted lab tests',
    color: '#ddd5f3',
    img: '🔬'
  },
  {
    title: 'Surgeries',
    desc: 'Safe and trusted surgery centers',
    color: '#f9d8d6',
    img: '🏥'
  }
];

const ServiceCards = () => {
  return (
    <div className="services-container">
      {services.map((service, index) => (
        <div key={index} className="service-card">
          <div className="service-image-box" style={{ backgroundColor: service.color }}>
            <span className="service-icon">{service.img}</span>
          </div>
          <div className="service-info">
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;