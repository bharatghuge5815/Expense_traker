import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Requirement Calculations
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (!hasMinLength) {
      setFormError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* MAIN FORM COLUMN */}
        <div className="auth-form-panel" style={{ maxWidth: '650px' }}>
          {/* Header Row: Back Arrow + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Link to="/login" style={{ color: '#0f172a', fontSize: '1.25rem', textDecoration: 'none' }} title="Back to login">
              ⬅️
            </Link>
            <div className="auth-brand-logo" style={{ marginBottom: 0 }}>
              <div className="auth-logo-icon">📈</div>
              <span className="auth-logo-text">Expense Tracker</span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
            Create your account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Fill in the details below to get started.
          </p>

          {formError && (
            <div className="status-badge error" style={{ width: '100%', marginBottom: '1.25rem', boxSizing: 'border-box' }}>
              <span className="dot error"></span>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="auth-input-group">
              <label className="auth-input-label">Full name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="auth-input-field"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-input-group">
              <label className="auth-input-label">Email address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="auth-input-field"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="auth-input-group">
              <label className="auth-input-label">Mobile number</label>
              <div className="auth-input-wrapper">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    position: 'absolute',
                    left: '0.5rem',
                    zIndex: 2,
                    padding: '0.4rem 0.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#f1f5f9',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    color: '#334155'
                  }}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <span className="auth-input-icon" style={{ left: '4.5rem' }}>📱</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter mobile number"
                  className="auth-input-field"
                  style={{ paddingLeft: '6.25rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="auth-input-field"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="auth-input-group">
              <label className="auth-input-label">Confirm password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="auth-input-field"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-password-toggle"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Password Requirements Box */}
            <div className="password-requirements-box">
              <div className="password-req-title">Password must contain:</div>
              <div className="password-req-grid">
                <div className={`req-item ${hasMinLength ? 'valid' : 'invalid'}`}>
                  {hasMinLength ? '✅' : '⚪'} At least 8 characters
                </div>
                <div className={`req-item ${hasNumber ? 'valid' : 'invalid'}`}>
                  {hasNumber ? '✅' : '⚪'} One number
                </div>
                <div className={`req-item ${hasUppercase ? 'valid' : 'invalid'}`}>
                  {hasUppercase ? '✅' : '⚪'} One uppercase letter
                </div>
                <div className={`req-item ${hasSpecialChar ? 'valid' : 'invalid'}`}>
                  {hasSpecialChar ? '✅' : '⚪'} One special character
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth-primary"
            >
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* Already have an account card */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '700' }}>
                Login
              </Link>
            </p>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Login with mobile number or email
            </span>
          </div>
        </div>

        {/* RIGHT FEATURE HIGHLIGHT PANEL */}
        <div className="auth-feature-panel">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-box">🛡️</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                Secure & Private
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Your data is 100% safe with us.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-box">📈</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                Track Easily
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Track expenses and income in seconds.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-box">📊</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                Smart Reports
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                Get insights and save more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
