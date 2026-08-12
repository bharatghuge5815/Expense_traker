import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getExpensesApi } from '../services/expenses.api';

const AVATAR_PRESETS = ['👤', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '🦸', '🚀', '🎓', '💼'];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Fields State
  const [name, setName] = useState(user?.name || 'Ajinkya Bhalerao');
  const [email, setEmail] = useState(user?.email || 'user@gmail.com');
  const [mobile, setMobile] = useState('+91 12345 67890');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [bio, setBio] = useState('Managing daily personal finances and savings goals smartly.');

  // Avatar State
  const [avatarImage, setAvatarImage] = useState(() => localStorage.getItem('user_avatar_image') || '');
  const [selectedEmoji, setSelectedEmoji] = useState(() => localStorage.getItem('user_avatar_emoji') || '👤');

  // Stats
  const [expenseCount, setExpenseCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpensesApi();
        if (res.success) {
          setExpenseCount(res.expenses?.length || 0);
        }
      } catch (err) {
        console.error('Failed to load user expenses:', err);
      }
    };
    fetchExpenses();
  }, []);

  // Handle Profile Picture File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPG and PNG image files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB maximum limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setAvatarImage(base64Image);
      localStorage.setItem('user_avatar_image', base64Image);
      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setAvatarImage('');
    localStorage.removeItem('user_avatar_image');
    localStorage.setItem('user_avatar_emoji', emoji);
    setSuccessMsg('Avatar updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('user_profile_name', name);
    localStorage.setItem('user_profile_email', email);
    setSuccessMsg('Profile details saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">My Profile 👤</h1>
            <p className="dashboard-subgreeting">
              Manage your personal details, avatar picture, and account settings
            </p>
          </div>

          <button
            className="btn-add-expense"
            onClick={() => navigate('/settings')}
            style={{ backgroundColor: '#ffffff', color: '#16a34a', border: '1px solid #16a34a', boxShadow: 'none' }}
          >
            ⚙️ Account Settings
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="status-badge connected" style={{ width: '100%', marginBottom: '1.5rem', padding: '0.85rem' }}>
            <span className="dot connected"></span>
            {successMsg}
          </div>
        )}

        {/* 2-Column Layout Grid */}
        <div className="dashboard-grid-2" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* LEFT COLUMN: Profile Picture & Preset Avatar Picker */}
          <div className="dashboard-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem' }}>
              Profile Picture
            </h3>

            {/* Avatar Display Container */}
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 1.25rem' }}>
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt="Profile Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #16a34a',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  border: '3px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.25rem',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
                }}>
                  {selectedEmoji}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)'
            }}>
              <span>📷</span> Upload New Picture
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>

            {/* Avatar Presets */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.65rem' }}>
                Or select an avatar emoji preset:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                {AVATAR_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelectEmoji(emoji)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      border: !avatarImage && selectedEmoji === emoji ? '2px solid #16a34a' : '1px solid #e2e8f0',
                      backgroundColor: !avatarImage && selectedEmoji === emoji ? '#f0fdf4' : '#ffffff',
                      fontSize: '1.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Quick Overview */}
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1.75rem', paddingTop: '1.25rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Member Since</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>May 2025</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Logged Expenses</span>
                <span style={{ fontWeight: '600', color: '#16a34a' }}>{expenseCount} entries</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Primary Currency</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>INR (₹)</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Profile Form */}
          <div className="dashboard-card" style={{ padding: '1.75rem' }}>
            <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem' }}>
              Edit Profile Details
            </h3>

            <form onSubmit={handleSaveProfile}>
              <div className="auth-input-group">
                <label className="auth-input-label">Full Name *</label>
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

              <div className="auth-input-group">
                <label className="auth-input-label">Email Address *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
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
                    placeholder="Enter mobile number"
                    className="auth-input-field"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Occupation / Role</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">💼</span>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer / Student"
                    className="auth-input-field"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="auth-input-label">Bio / Spending Objective</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-auth-primary"
                  style={{ width: 'auto', padding: '0.75rem 1.75rem' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
