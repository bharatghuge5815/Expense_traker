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
      {/* Top Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📈</div>
        <span className="sidebar-logo-text">Expense Tracker</span>
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

        <div className="sidebar-nav-item disabled">
          <span className="nav-icon">🏷️</span>
          <span>Categories</span>
        </div>

        <div className="sidebar-nav-item disabled">
          <span className="nav-icon">🎯</span>
          <span>Goals</span>
        </div>

        <div className="sidebar-nav-item disabled">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </div>
      </nav>

      {/* Goal Promo Card */}
      <div className="sidebar-promo-card">
        <h4>Track. Save. Achieve.</h4>
        <p>Set budgets and achieve your financial goals faster.</p>
        <div className="promo-illustration">🐷</div>
        <button className="btn-promo" onClick={() => alert('Goal tracking feature active.')}>
          Set Goal
        </button>
      </div>

      {/* User Profile Pill */}
      <div className="sidebar-user-pill">
        <div className="user-avatar">👤</div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'Ajinkya B.'}</div>
          <div className="user-mobile">+91 12345 67890</div>
        </div>
        <button onClick={handleLogout} className="user-logout-btn" title="Logout">
          🚪
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
