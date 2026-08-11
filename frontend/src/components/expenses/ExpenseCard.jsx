import React from 'react';

const getCategoryColor = (categoryName) => {
  switch ((categoryName || '').toLowerCase()) {
    case 'food': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
    case 'travel': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    case 'shopping': return { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };
    case 'bills': return { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: 'rgba(234, 179, 8, 0.3)' };
    case 'entertainment': return { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' };
    case 'education': return { bg: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', border: 'rgba(20, 184, 166, 0.3)' };
    case 'health': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    default: return { bg: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' };
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const badgeStyle = getCategoryColor(expense.category_name);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '0.85rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'transform 0.2s ease, border-color 0.2s ease'
    }}>
      <div style={{ flex: 1, paddingRight: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: badgeStyle.bg,
            color: badgeStyle.color,
            border: `1px solid ${badgeStyle.border}`
          }}>
            {expense.category_name || 'Category'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {formatDate(expense.expense_date)}
          </span>
        </div>

        <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: '600' }}>
          {expense.description || expense.category_name}
        </h4>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#10b981'
          }}>
            ₹{Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(expense)}
            title="Edit Expense"
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#334155',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            title="Delete Expense"
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
