import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
};

const RecentExpenses = ({ recentExpenses = [] }) => {
  if (!recentExpenses || recentExpenses.length === 0) {
    return (
      <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '0.9rem' }}>No recent expenses recorded.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
          Recent Expenses
        </h3>
        <Link to="/expenses" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
          View All →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {recentExpenses.map((expense) => (
          <div
            key={expense.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1rem',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {expense.category_name}
                </span>
                {expense.description && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    • {expense.description}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {formatDate(expense.expense_date)}
              </span>
            </div>

            <div>
              <span style={{ fontWeight: '700', color: '#10b981', fontSize: '1rem' }}>
                ₹{Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExpenses;
