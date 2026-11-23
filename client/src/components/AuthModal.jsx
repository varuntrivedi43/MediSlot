import React, { useState } from 'react';
import './AuthModal.css';

/**
 * AuthModal Component
 * Handles User Login and Registration popup with real MongoDB integration.
 */
const AuthModal = ({ onClose, onLoginSuccess }) => {
  // Mode: 'login' ya 'register'
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Status & Error handling
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isLoginMode 
      ? 'http://localhost:3000/api/auth/login' 
      : 'http://localhost:3000/api/auth/register';

    const payload = isLoginMode 
      ? { phone } 
      : { name, phone, email };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Success: LocalStorage me user save karein aur Navbar notify karein
      localStorage.setItem('medislot_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose}>✕</button>

        {/* Modal Header */}
        <div className="auth-header">
          <h2>{isLoginMode ? 'Login to MediSlot' : 'Join MediSlot'}</h2>
          <p>
            {isLoginMode 
              ? 'Access your appointments, medical records & prescriptions' 
              : 'Sign up to book appointments and consult verified doctors'}
          </p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <div className="auth-form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="auth-form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              required
              pattern="[0-9]{10}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {!isLoginMode && (
            <div className="auth-form-group">
              <label>Email ID (Optional)</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : isLoginMode ? 'Login' : 'Register & Continue'}
          </button>
        </form>

        {/* Switch between Login and Register */}
        <div className="auth-switch-footer">
          {isLoginMode ? (
            <p>
              New to MediSlot?{' '}
              <button 
                type="button" 
                className="switch-link"
                onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                className="switch-link"
                onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;