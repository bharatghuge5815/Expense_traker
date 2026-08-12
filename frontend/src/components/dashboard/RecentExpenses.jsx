import React from 'react';
import { Link } from 'react-router-dom';

const getCategoryIcon = (categoryName) => {
  switch ((categoryName || '').toLowerCase()) {
    case 'food':
    case 'food & dining': return { icon: '🛒', bg: '#dcfce7', color: '#16a34a' };
    case 'travel':
    case 'transport': return { icon: '🚌', bg: '#dbeafe', color: '#2563eb' };
    case 'shopping': return { bg: '#fef3c7', icon: '📦', color: '#d97706' };
    case 'bills':
    case 'bills & utilities': return { icon: '⚡', bg: '#f3e8ff', color: '#9333ea' };
    case 'entertainment': return { icon: '🍿', bg: '#fce7f3', color: '#db2777' };
    default: return { icon: '💳', bg: '#f1f5f9', color: '#475569' };
  }
};

const formatDateLabel = (dateString) => {
  if (!dateString) return 'Today';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const RecentExpenses = ({ recentExpenses = [] }) => {
  const displayList = recentExpenses.length > 0
    ? recentExpenses.slice(0, 5)
    : [
        { id: 1, description: 'Grocery Store', category_name: 'Food & Dining', amount: 850, expense_date: new Date().toISOString() },
        { id: 2, description: 'Bus Pass', category_name: 'Transport', amount: 450, expense_date: new Date().toISOString() },
        { id: 3, description: 'Amazon Purchase', category_name: 'Shopping', amount: 1299, expense_date: new Date(Date.now() - 86400000).toISOString() },
        { id: 4, description: 'Electricity Bill', category_name: 'Bills & Utilities', amount: 1650, expense_date: '2026-05-01' }
      ];

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Recent Transactions</h3>
        <Link to="/expenses" className="dashboard-card-link">View All</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {displayList.map((item) => {
          const style = getCategoryIcon(item.category_name);
          const isIncome = item.description && item.description.toLowerCase().includes('salary');

          return (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: style.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  {style.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.925rem', fontWeight: '600', color: '#0f172a' }}>
                    {item.description || item.category_name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {item.category_name}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: isIncome ? '#16a34a' : '#0f172a'
                  }}>
                    {isIncome ? '+' : '-'} ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {formatDateLabel(item.expense_date)}
                  </div>
                </div>
                <span style={{ color: '#cbd5e1', cursor: 'pointer', fontSize: '1.1rem' }}>⋮</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentExpenses;
