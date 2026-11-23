import React, { useState } from 'react';
import './HelpModal.css';

const HelpModal = ({ currentUser, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userName: currentUser ? currentUser.name : "Guest",
      userPhone: currentUser ? currentUser.phone : "Not Provided",
      subject,
      message
    };

    try {
      const response = await fetch('http://localhost:3000/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) setSubmitted(true);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        {!submitted ? (
          <>
            <h2>Security & Help Support</h2>
            <p>How can we help you today?</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
                  <option value="">Select a topic</option>
                  <option value="Booking Issue">Booking Issue</option>
                  <option value="Payment Query">Payment Query</option>
                  <option value="Doctor Feedback">Doctor Feedback</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>
              <div className="input-group">
                <label>Message</label>
                <textarea 
                  placeholder="Describe your issue in detail..." 
                  required 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="submit-query-btn">Submit Request</button>
            </form>
          </>
        ) : (
          <div className="success-msg">
            <div className="check-icon">✓</div>
            <h3>Request Submitted!</h3>
            <p>Our support team will get back to you within 24 hours.</p>
            <button className="submit-query-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;