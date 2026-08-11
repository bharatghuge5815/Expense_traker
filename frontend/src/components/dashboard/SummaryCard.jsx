import React from 'react';

const SummaryCard = ({ title, value, icon, accentColor = '#6366f1', isCount = false }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div>
        <span style={{
          display: 'block',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.35rem',
          fontWeight: '600'
        }}>
          {title}
        </span>
        <span style={{
          fontSize: '1.6rem',
          fontWeight: '700',
          color: 'var(--text-main)'
        }}>
          {isCount ? value : `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
        </span>
      </div>

      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${accentColor}20`,
        border: `1px solid ${accentColor}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem'
      }}>
        {icon}
      </div>
    </div>
  );
};

export default SummaryCard;
