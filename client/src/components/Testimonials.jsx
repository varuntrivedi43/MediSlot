import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2>What our users have to say</h2>
        
        <div className="testimonial-content">
          <p className="quote-text">
            "Very good app. Well thought out about booking/rescheduling/canceling an appointment. Also, Doctor's feedback mechanism is good and describes all the basics in a good way."
          </p>
          <div className="user-profile">
            <div className="user-avatar">AK</div>
            <p className="user-name">Avinash Kumar</p>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="dots-container">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot active"></span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;