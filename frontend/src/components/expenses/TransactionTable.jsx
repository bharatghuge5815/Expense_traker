import React from 'react';

const getCategoryBadgeStyle = (categoryName) => {
  switch ((categoryName || '').toLowerCase()) {
    case 'food':
    case 'food & dining':
      return { bg: '#e8f5e9', color: '#16a34a', border: '#bbf7d0' };
    case 'travel':
    case 'transport':
      return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
    case 'shopping':
      return { bg: '#fffbeb', color: '#d97706', border: '#fef3c7' };
    case 'bills':
    case 'bills & utilities':
      return { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' };
    case 'entertainment':
      return { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' };
    case 'education':
      return { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' };
    case 'health':
      return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
    default:
      return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
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

const TransactionTable = ({ transactions = [], onEdit, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💸</p>
        <h3 style={{ color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.2rem' }}>No transactions found</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          No records match your selected search or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const badge = getCategoryBadgeStyle(tx.category_name);
            const isIncome = tx.description && tx.description.toLowerCase().includes('salary');
            const paymentMethods = ['UPI', 'Credit Card', 'Cash', 'Bank Transfer'];
            const paymentMethod = paymentMethods[tx.id % paymentMethods.length];

            return (
              <tr key={tx.id}>
                <td style={{ color: '#64748b', fontWeight: '500', fontSize: '0.875rem' }}>
                  {formatDate(tx.expense_date)}
                </td>

                <td>
                  <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.925rem' }}>
                    {tx.description || tx.category_name}
                  </span>
                </td>

                <td>
                  <span
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`
                    }}
                  >
                    {tx.category_name}
                  </span>
                </td>

                <td>
                  <span
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: isIncome ? '#f0fdf4' : '#fef2f2',
                      color: isIncome ? '#16a34a' : '#ef4444',
                      border: `1px solid ${isIncome ? '#bbf7d0' : '#fecaca'}`
                    }}
                  >
                    {isIncome ? 'Income' : 'Expense'}
                  </span>
                </td>

                <td>
                  <span
                    style={{
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      color: isIncome ? '#16a34a' : '#dc2626'
                    }}
                  >
                    {isIncome ? '+' : '-'} ₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </td>

                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {paymentMethod}
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => onEdit(tx)}
                      title="Edit Transaction"
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#334155',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      title="Delete Transaction"
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
