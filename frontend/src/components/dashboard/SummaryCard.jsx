import React from 'react';

const SummaryCard = ({ title, value, icon, trend, isNegative = false, iconBg = '#dcfce7', iconColor = '#16a34a', onEdit }) => {
  return (
    <div className="stat-card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div className="stat-icon-wrapper" style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>

        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#16a34a',
              fontWeight: '600',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
            title="Edit income amount"
          >
            ✏️ Edit
          </button>
        )}
      </div>

      <div className="stat-title">{title}</div>
      <div className="stat-value">
        ₹ {Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </div>

      {trend && (
        <div className={`stat-trend ${isNegative ? 'negative' : 'positive'}`}>
          {isNegative ? '▲' : '▲'} {trend}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
