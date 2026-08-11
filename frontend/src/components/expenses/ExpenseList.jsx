import React from 'react';
import ExpenseCard from './ExpenseCard';

const ExpenseList = ({ expenses = [], loading, error, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div className="status-badge loading" style={{ display: 'inline-flex' }}>
          <span className="dot loading"></span>
          Loading expenses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="status-badge error" style={{ width: '100%' }}>
          <span className="dot error"></span>
          {error}
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💸</p>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No expenses found</h3>
        <p style={{ fontSize: '0.9rem' }}>
          No personal expenses match your search/filter criteria. Click <strong>+ Add Expense</strong> above to record a new expense.
        </p>
      </div>
    );
  }

  return (
    <div>
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
