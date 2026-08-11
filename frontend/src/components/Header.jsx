import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <div>
        <h1>Expense Tracker</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          {isAuthenticated ? `Signed in as ${user?.name}` : 'Full-Stack Scaffold'}
        </p>
      </div>
      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/expenses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Expenses
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Profile
            </NavLink>
            <button
              onClick={logout}
              className="nav-link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#f87171'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Register
            </NavLink>
            <NavLink to="/health" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              API Status
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
