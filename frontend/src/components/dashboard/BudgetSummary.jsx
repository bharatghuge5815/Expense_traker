import React from 'react';
import { Link } from 'react-router-dom';

const defaultBudgets = [
  { icon: '🍴', category: 'Food & Dining', spent: 8280, limit: 12000, color: '#16a34a' },
  { icon: '🚌', category: 'Transport', spent: 4730, limit: 8000, color: '#3b82f6' },
  { icon: '🛍️', category: 'Shopping', spent: 3550, limit: 6000, color: '#f59e0b' },
  { icon: '⚡', category: 'Bills & Utilities', spent: 2365, limit: 5000, color: '#a855f7' }
];

const BudgetSummary = ({ categoryBreakdown = [] }) => {
  const budgetList = categoryBreakdown.length > 0
    ? categoryBreakdown.slice(0, 4).map((c, idx) => {
        const icons = ['🍴', '🚌', '🛍️', '⚡', '💗', '🎯'];
        const colors = ['#16a34a', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899'];
        const limit = Number(c.amount) * 1.5 || 5000;
        return {
          icon: icons[idx % icons.length],
          category: c.category,
          spent: Number(c.amount),
          limit: Math.round(limit),
          color: colors[idx % colors.length]
        };
      })
    : defaultBudgets;

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Budget Summary</h3>
        <Link to="/expenses" className="dashboard-card-link">View All</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {budgetList.map((item) => {
          const percent = Math.min(100, Math.round((item.spent / item.limit) * 100));

          return (
            <div key={item.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', display: 'block' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ₹{item.spent.toLocaleString('en-IN')} / ₹{item.limit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                  {percent}%
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                height: '6px',
                width: '100%',
                backgroundColor: '#f1f5f9',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  backgroundColor: item.color,
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetSummary;
