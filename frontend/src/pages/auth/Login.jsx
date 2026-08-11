import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Mobile Login State
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpSent, setOtpSent] = useState(false);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setFormError('');
    alert(`OTP sent to ${countryCode} ${mobileNumber}`);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* LEFT HERO PANEL */}
        <div className="auth-hero-panel">
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              lineHeight: '1.2',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '1rem',
              background: 'none',
              WebkitTextFillColor: 'initial'
            }}>
              Welcome back!<br />
              <span style={{ color: '#16a34a' }}>Let’s manage your expenses smartly.</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Track, analyze, and save more every day.
            </p>
          </div>

          {/* 3D Mobile Mockup Graphic */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <img
              src="/hero_mockup.png"
              alt="Expense Tracker App Mockup"
              style={{
                maxWidth: '90%',
                maxHeight: '420px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 30px rgba(22, 163, 74, 0.15))',
                borderRadius: '24px'
              }}
            />
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="auth-form-panel">
          {/* Logo Badge Header */}
          <div className="auth-brand-logo">
            <div className="auth-logo-icon">📈</div>
            <span className="auth-logo-text">Expense Tracker</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
            Login to your account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Welcome back! Please enter your details.
          </p>

          {formError && (
            <div className="status-badge error" style={{ width: '100%', marginBottom: '1.25rem', boxSizing: 'border-box' }}>
              <span className="dot error"></span>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            {/* Password */}
            <div className="auth-input-group" style={{ marginBottom: '1rem' }}>
              <label className="auth-input-label">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#16a34a', width: '16px', height: '16px' }}
                />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email.'); }} style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '600' }}>
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth-primary"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* Login with Mobile Number Box */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              <span>📱</span> Login with Mobile Number
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontWeight: '600',
                  color: '#334155'
                }}
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#e6f4ea',
                color: '#16a34a',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              We will send a 6-digit OTP to your number
            </p>
          </div>

          {/* Footer Navigation */}
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '700' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
