import React from 'react';

const SummaryCard = ({ title, value, icon, trend, isNegative = false, iconBg = '#dcfce7', iconColor = '#16a34a' }) => {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div className="stat-icon-wrapper" style={{ backgroundColor: iconBg, color: iconColor }}>
          {icon}
        </div>
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
