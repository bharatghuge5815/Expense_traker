import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getExpensesApi, getCategoriesApi } from '../services/expenses.api';

const DEFAULT_BUDGET_LIMITS = {
  'Food & Dining': 12000,
  'Food': 12000,
  'Transport': 8000,
  'Travel': 8000,
  'Shopping': 6000,
  'Bills & Utilities': 5000,
  'Bills': 5000,
  'Entertainment': 4000,
  'Health': 5000,
  'Education': 10000,
  'Rent': 15000,
  'Hostel': 10000,
  'Other': 5000
};

const Budgets = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState(() => {
    const saved = localStorage.getItem('category_budget_limits');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGET_LIMITS;
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimitInput, setNewLimitInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, expRes] = await Promise.all([
          getCategoriesApi(),
          getExpensesApi()
        ]);

        if (catRes.success) setCategories(catRes.categories || []);
        if (expRes.success) setExpenses(expRes.expenses || []);
      } catch (err) {
        console.error('Failed to load budget data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute spent amount per category
  const categorySpentMap = {};
  expenses.forEach((item) => {
    const catName = item.category_name || 'Other';
    categorySpentMap[catName] = (categorySpentMap[catName] || 0) + Number(item.amount || 0);
  });

  // Calculate global budget metrics
  const displayCategories = categories.length > 0
    ? categories.map(c => c.name)
    : Object.keys(DEFAULT_BUDGET_LIMITS);

  let totalBudget = 0;
  let totalSpent = 0;

  displayCategories.forEach((catName) => {
    const limit = budgetLimits[catName] || DEFAULT_BUDGET_LIMITS[catName] || 5000;
    const spent = categorySpentMap[catName] || 0;
    totalBudget += limit;
    totalSpent += spent;
  });

  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const isOverBudget = totalSpent > totalBudget;

  const handleOpenEdit = (catName, currentLimit) => {
    setEditingCategory(catName);
    setNewLimitInput(currentLimit.toString());
  };

  const handleSaveLimit = (e) => {
    e.preventDefault();
    const numLimit = Number(newLimitInput);
    if (isNaN(numLimit) || numLimit <= 0) {
      alert('Please enter a valid positive number for the budget limit.');
      return;
    }

    const updated = { ...budgetLimits, [editingCategory]: numLimit };
    setBudgetLimits(updated);
    localStorage.setItem('category_budget_limits', JSON.stringify(updated));
    setEditingCategory(null);
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">Budgets</h1>
            <p className="dashboard-subgreeting">
              Set and manage monthly budget limits per category
            </p>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="dashboard-grid-4" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-title">Total Monthly Budget</div>
            <div className="stat-value">₹ {totalBudget.toLocaleString('en-IN')}</div>
            <div className="stat-trend positive">Allocated limits</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Total Spent</div>
            <div className="stat-value" style={{ color: isOverBudget ? '#ef4444' : '#0f172a' }}>
              ₹ {totalSpent.toLocaleString('en-IN')}
            </div>
            <div className={`stat-trend ${isOverBudget ? 'negative' : 'positive'}`}>
              {((totalSpent / (totalBudget || 1)) * 100).toFixed(0)}% of total budget
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Remaining Budget</div>
            <div className="stat-value" style={{ color: '#16a34a' }}>
              ₹ {totalRemaining.toLocaleString('en-IN')}
            </div>
            <div className="stat-trend positive">Available to spend</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Budget Health</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>
              {isOverBudget ? '⚠️ Over Budget' : '✅ On Track'}
            </div>
            <div className={`stat-trend ${isOverBudget ? 'negative' : 'positive'}`}>
              {isOverBudget ? 'Needs review' : 'Healthy spending'}
            </div>
          </div>
        </div>

        {/* Edit Limit Modal */}
        {editingCategory && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="dashboard-card" style={{ width: '100%', maxWidth: '400px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                Set Budget Limit
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Category: <strong style={{ color: '#16a34a' }}>{editingCategory}</strong>
              </p>

              <form onSubmit={handleSaveLimit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="auth-input-label">Monthly Limit (₹)</label>
                  <input
                    type="number"
                    value={newLimitInput}
                    onChange={(e) => setNewLimitInput(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#64748b',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-auth-primary"
                    style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                  >
                    Save Limit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Budgets Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {displayCategories.map((catName) => {
            const limit = budgetLimits[catName] || DEFAULT_BUDGET_LIMITS[catName] || 5000;
            const spent = categorySpentMap[catName] || 0;
            const percent = Math.round((spent / limit) * 100);
            const isExceeded = spent > limit;
            const isNearLimit = percent >= 80 && !isExceeded;

            let badgeBg = '#f0fdf4';
            let badgeColor = '#16a34a';
            let badgeText = '✅ On Track';
            let barColor = '#16a34a';

            if (isExceeded) {
              badgeBg = '#fef2f2';
              badgeColor = '#ef4444';
              badgeText = '🚨 Over Budget';
              barColor = '#ef4444';
            } else if (isNearLimit) {
              badgeBg = '#fffbeb';
              badgeColor = '#d97706';
              badgeText = '⚠️ Near Limit';
              barColor = '#f59e0b';
            }

            return (
              <div key={catName} className="dashboard-card" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                      {catName}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      ₹{spent.toLocaleString('en-IN')} of ₹{limit.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: badgeBg,
                    color: badgeColor
                  }}>
                    {badgeText}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '8px',
                  width: '100%',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, percent)}%`,
                    backgroundColor: barColor,
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                    {percent}% used
                  </span>

                  <button
                    onClick={() => handleOpenEdit(catName, limit)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#16a34a',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Edit Limit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Budgets;
