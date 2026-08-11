import React from 'react';

const getCategoryColor = (categoryName) => {
  switch ((categoryName || '').toLowerCase()) {
    case 'food': return '#f87171';
    case 'travel': return '#60a5fa';
    case 'shopping': return '#c084fc';
    case 'bills': return '#facc15';
    case 'entertainment': return '#f472b6';
    case 'education': return '#2dd4bf';
    case 'health': return '#34d399';
    default: return '#94a3b8';
  }
};

const CategoryBreakdown = ({ categoryBreakdown = [], totalExpenses = 0 }) => {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '0.9rem' }}>No category data available yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
        Category Spending
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categoryBreakdown.map((item) => {
          const percent = totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(1) : 0;
          const color = getCategoryColor(item.category);

          return (
            <div key={item.category}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                  {item.category}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)', marginRight: '0.5rem' }}>
                    ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ({percent}%)
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: '#0f172a',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  backgroundColor: color,
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

export default CategoryBreakdown;
