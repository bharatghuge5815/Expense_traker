import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            Welcome back, {user?.name || 'User'}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Authenticated Session Active
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          User Profile Details
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>User ID:</span>
          <span style={{ fontWeight: '600', color: '#a7f3d0' }}>#{user?.id}</span>

          <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
          <span>{user?.name}</span>

          <span style={{ color: 'var(--text-muted)' }}>Email:</span>
          <span>{user?.email}</span>

          <span style={{ color: 'var(--text-muted)' }}>Joined:</span>
          <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Just now'}</span>
        </div>
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
        <strong style={{ color: '#34d399' }}>✓ Step 1 Authentication Complete:</strong> JWT payload verified via <code>/api/auth/me</code>. Password hash is securely stored in MySQL and never exposed to the client.
      </div>
    </div>
  );
};

export default Home;
