import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="app-sidebar">
      {/* Top Logo & User Profile Header Card */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="sidebar-logo" style={{ marginBottom: '0.85rem' }}>
          <div className="sidebar-logo-icon">📈</div>
          <span className="sidebar-logo-text">Expense Tracker</span>
        </div>

        {/* User Card Under Expense Tracker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.6rem 0.75rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0
          }}>
            👤
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Ajinkya Bhalerao'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || 'user@gmail.com'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Links with Exact Emojis */}
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/expenses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📝</span>
          <span>Transactions</span>
        </NavLink>

        <NavLink to="/add-expense" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">➕</span>
          <span>Add Expense</span>
        </NavLink>

        <NavLink to="/budgets" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">💰</span>
          <span>Budgets</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📈</span>
          <span>Reports</span>
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏷️</span>
          <span>Categories</span>
        </NavLink>

        <NavLink to="/goals" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🎯</span>
          <span>Goals</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Goal Promo Card */}
      <div className="sidebar-promo-card">
        <h4>Track. Save. Achieve.</h4>
        <p>Set budgets and achieve your financial goals faster.</p>
        <div className="promo-illustration">🎯</div>
        <button className="btn-promo" onClick={() => navigate('/goals')}>
          Set Goal
        </button>
      </div>

      {/* Left Bottom Corner Logout Button */}
      <div className="sidebar-user-section">
        <button onClick={handleLogout} className="sidebar-logout-btn" title="Logout of session">
          <span style={{ fontSize: '1.1rem' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
