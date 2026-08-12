import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Ajinkya Bhalerao');
  const [email, setEmail] = useState(user?.email || 'ajinkya@example.com');
  const [mobile, setMobile] = useState('+91 12345 67890');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Preference State
  const [currency, setCurrency] = useState(() => localStorage.getItem('user_currency') || 'INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Notification Toggles State
  const [budgetAlerts, setBudgetAlerts] = useState(() => localStorage.getItem('notif_budget_alerts') !== 'false');
  const [weeklyReports, setWeeklyReports] = useState(() => localStorage.getItem('notif_weekly_reports') !== 'false');
  const [monthlyReminders, setMonthlyReminders] = useState(true);
  const [notifSuccess, setNotifSuccess] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSuccess('Profile details updated successfully!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem('user_currency', currency);
    setNotifSuccess('Preferences saved!');
    setTimeout(() => setNotifSuccess(''), 3000);
  };

  const handleToggle = (setter, key, val) => {
    setter(val);
    localStorage.setItem(key, val.toString());
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleClearCache = () => {
    if (window.confirm('Clear all local app cache and saved preferences?')) {
      localStorage.clear();
      alert('Local cache cleared. Reloading page...');
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">Settings ⚙️</h1>
            <p className="dashboard-subgreeting">
              Manage your account preferences, currency, notifications, and security
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Grid Layout */}
        <div className="dashboard-grid-2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* LEFT COLUMN: Profile & Preferences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. PROFILE SETTINGS */}
            <div className="dashboard-card" style={{ padding: '1.5rem' }}>
              <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👤 Account Profile
              </h3>

              {profileSuccess && (
                <div className="status-badge connected" style={{ width: '100%', marginBottom: '1rem' }}>
                  <span className="dot connected"></span>
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div className="auth-input-group">
                  <label className="auth-input-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">👤</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="auth-input-field"
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">✉️</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input-field"
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Mobile Number</label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">📱</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="auth-input-field"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto', padding: '0.65rem 1.5rem' }}
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* 2. CURRENCY & DISPLAY */}
            <div className="dashboard-card" style={{ padding: '1.5rem' }}>
              <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💱 Currency & Display
              </h3>

              {notifSuccess && (
                <div className="status-badge connected" style={{ width: '100%', marginBottom: '1rem' }}>
                  <span className="dot connected"></span>
                  {notifSuccess}
                </div>
              )}

              <form onSubmit={handleSavePreferences}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="auth-input-label">Default Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="auth-input-field"
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="auth-input-label">Date Format</label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="auth-input-field"
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto', padding: '0.65rem 1.5rem' }}
                >
                  Save Preferences
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Notifications, Security & Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 3. NOTIFICATION ALERTS */}
            <div className="dashboard-card" style={{ padding: '1.5rem' }}>
              <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔔 Notification Alerts
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* Switch 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', display: 'block' }}>
                      Budget Limit Alerts
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Warn when category exceeds 80% limit
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={budgetAlerts}
                    onChange={(e) => handleToggle(setBudgetAlerts, 'notif_budget_alerts', e.target.checked)}
                    style={{ accentColor: '#16a34a', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                {/* Switch 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', display: 'block' }}>
                      Weekly Summary Reports
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Receive email summary every Sunday
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyReports}
                    onChange={(e) => handleToggle(setWeeklyReports, 'notif_weekly_reports', e.target.checked)}
                    style={{ accentColor: '#16a34a', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                {/* Switch 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', display: 'block' }}>
                      Monthly Statement Reminders
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Notification on 1st of every month
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={monthlyReminders}
                    onChange={(e) => setMonthlyReminders(e.target.checked)}
                    style={{ accentColor: '#16a34a', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* 4. PASSWORD & SECURITY */}
            <div className="dashboard-card" style={{ padding: '1.5rem' }}>
              <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔒 Security & Password
              </h3>

              {passwordSuccess && (
                <div className="status-badge connected" style={{ width: '100%', marginBottom: '1rem' }}>
                  <span className="dot connected"></span>
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="status-badge error" style={{ width: '100%', marginBottom: '1rem' }}>
                  <span className="dot error"></span>
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleUpdatePassword}>
                <div className="auth-input-group">
                  <label className="auth-input-label">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto', padding: '0.65rem 1.5rem' }}
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* 5. DATA & CACHE */}
            <div className="dashboard-card" style={{ padding: '1.5rem', backgroundColor: '#fff5f5', border: '1px solid #fed7d7' }}>
              <h3 className="dashboard-card-title" style={{ color: '#c53030', marginBottom: '0.85rem' }}>
                🗑️ System & Data Reset
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#742a2a', marginBottom: '1.15rem' }}>
                Clear local storage cache or reset session preferences.
              </p>

              <button
                type="button"
                onClick={handleClearCache}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #e53e3e',
                  backgroundColor: '#ffffff',
                  color: '#e53e3e',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Clear Local Storage Cache
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
