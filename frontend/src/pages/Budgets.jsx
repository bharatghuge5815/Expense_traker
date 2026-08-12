import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getExpensesApi, getCategoriesApi } from '../services/expenses.api';

const DEFAULT_BUDGET_LIMITS = {
  'Education': 10000,
  'Food & Dining': 12000,
  'Food': 12000,
  'Transport': 8000,
  'Travel': 8000,
  'Shopping': 6000,
  'Bills & Utilities': 5000,
  'Bills': 5000,
  'Entertainment': 4000,
  'Health': 5000,
  'Rent': 15000,
  'Hostel': 10000,
  'Other': 5000
};

const CATEGORY_EMOJIS = {
  'Education': '🎓',
  'Food & Dining': '🍔',
  'Food': '🍔',
  'Transport': '🚌',
  'Travel': '🚌',
  'Shopping': '🛍️',
  'Bills & Utilities': '⚡',
  'Bills': '⚡',
  'Entertainment': '🍿',
  'Health': '🏥',
  'Rent': '🏠',
  'Hostel': '🏠',
  'Other': '📦'
};

const Budgets = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  const [budgetLimits, setBudgetLimits] = useState(() => {
    const saved = localStorage.getItem('category_budget_limits');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGET_LIMITS;
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState('Food & Dining');
  const [modalLimitInput, setModalLimitInput] = useState('');
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

  // Category list
  const displayCategories = categories.length > 0
    ? Array.from(new Set(categories.map(c => c.name)))
    : ['Education', 'Food & Dining', 'Transport', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Other'];

  // Global calculations
  let totalBudget = 0;
  let totalSpent = 0;

  displayCategories.forEach((catName) => {
    const limit = budgetLimits[catName] || DEFAULT_BUDGET_LIMITS[catName] || 5000;
    const spent = categorySpentMap[catName] || 0;
    totalBudget += limit;
    totalSpent += spent;
  });

  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const isOverBudget = totalSpent > totalBudget;

  const handleOpenModal = (catName = 'Food & Dining') => {
    setModalCategory(catName);
    const currentLimit = budgetLimits[catName] || DEFAULT_BUDGET_LIMITS[catName] || 5000;
    setModalLimitInput(currentLimit.toString());
    setShowModal(true);
  };

  const handleSaveModalLimit = (e) => {
    e.preventDefault();
    const numLimit = Number(modalLimitInput);
    if (isNaN(numLimit) || numLimit <= 0) {
      alert('Please enter a valid positive number for the budget limit.');
      return;
    }

    const updated = { ...budgetLimits, [modalCategory]: numLimit };
    setBudgetLimits(updated);
    localStorage.setItem('category_budget_limits', JSON.stringify(updated));
    setShowModal(false);
  };

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        {/* 1. HEADER */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">
              Budgets 🐷
            </h1>
            <p className="dashboard-subgreeting">
              Set and manage your monthly budget limits
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="date-filter-pill"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>

            <button className="btn-add-expense" onClick={() => handleOpenModal('Food & Dining')}>
              + Add Budget
            </button>
          </div>
        </div>

        {/* 2. 4 SUMMARY CARDS */}
        <div className="dashboard-grid-4" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              💰
            </div>
            <div className="stat-title">Total Monthly Budget</div>
            <div className="stat-value">₹ {totalBudget.toLocaleString('en-IN')}</div>
            <div className="stat-trend positive">Allocated limits</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
              💸
            </div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value" style={{ color: isOverBudget ? '#ef4444' : '#0f172a' }}>
              ₹ {totalSpent.toLocaleString('en-IN')}
            </div>
            <div className={`stat-trend ${isOverBudget ? 'negative' : 'positive'}`}>
              {totalPercentage}% of total budget
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
              💵
            </div>
            <div className="stat-title">Remaining Budget</div>
            <div className="stat-value" style={{ color: '#16a34a' }}>
              ₹ {totalRemaining.toLocaleString('en-IN')}
            </div>
            <div className="stat-trend positive">Available to spend</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              📈
            </div>
            <div className="stat-title">Budget Health</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>
              {isOverBudget ? '⚠️ Over Budget' : '✅ On Track'}
            </div>
            <div className={`stat-trend ${isOverBudget ? 'negative' : 'positive'}`}>
              {isOverBudget ? 'Review spending' : 'Healthy allocation'}
            </div>
          </div>
        </div>

        {/* 3. MAIN SECTION: BUDGET BY CATEGORY CARD */}
        <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h3 className="dashboard-card-title" style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
            Budget by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {displayCategories.map((catName) => {
              const limit = budgetLimits[catName] || DEFAULT_BUDGET_LIMITS[catName] || 5000;
              const spent = categorySpentMap[catName] || 0;
              const percent = Math.round((spent / limit) * 100);
              const remaining = Math.max(0, limit - spent);
              const isOver = spent > limit;
              const emoji = CATEGORY_EMOJIS[catName] || '📦';

              // Status Colors:
              // 0-60% -> Green (#16a34a)
              // 60-80% -> Blue (#3b82f6)
              // 80-100% -> Orange (#f59e0b)
              // >100% -> Red (#ef4444)
              let statusColor = '#16a34a';
              if (isOver) {
                statusColor = '#ef4444';
              } else if (percent >= 80) {
                statusColor = '#f59e0b';
              } else if (percent >= 60) {
                statusColor = '#3b82f6';
              }

              return (
                <div
                  key={catName}
                  style={{
                    padding: '1.15rem 1.25rem',
                    border: '1px solid #f1f5f9',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {/* Top Line: Emoji + Name & Spent of Budget */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                        {catName}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                        ₹{spent.toLocaleString('en-IN')} of ₹{limit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Middle Line: Progress Bar */}
                  <div style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginBottom: '0.65rem'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, percent)}%`,
                      backgroundColor: statusColor,
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>

                  {/* Bottom Line: Percentage used, Remaining left, Edit button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: '600', color: statusColor }}>
                        {percent}% used {isOver && <span style={{ color: '#ef4444', fontWeight: '700' }}>(Over Budget)</span>}
                      </span>
                      <span style={{ color: '#64748b' }}>
                        ₹{remaining.toLocaleString('en-IN')} left
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenModal(catName)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#16a34a',
                        fontWeight: '600',
                        fontSize: '0.825rem',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. BOTTOM INSIGHT CARD */}
        <div className="dashboard-bottom-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              💡
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                Tip: You've used {totalPercentage}% of your total budget.
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Keep tracking your expenses to stay on top of your finances.
              </p>
            </div>
          </div>

          <button
            className="btn-view-reports"
            onClick={() => navigate('/reports')}
          >
            View Reports
          </button>
        </div>

        {/* ADD / EDIT BUDGET MODAL */}
        {showModal && (
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
            <div className="dashboard-card" style={{ width: '100%', maxWidth: '420px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                Set Budget Limit
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Set monthly allocation limit for categories
              </p>

              <form onSubmit={handleSaveModalLimit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="auth-input-label">Select Category</label>
                  <select
                    value={modalCategory}
                    onChange={(e) => {
                      setModalCategory(e.target.value);
                      const current = budgetLimits[e.target.value] || DEFAULT_BUDGET_LIMITS[e.target.value] || 5000;
                      setModalLimitInput(current.toString());
                    }}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    {displayCategories.map(c => (
                      <option key={c} value={c}>{CATEGORY_EMOJIS[c] || '📦'} {c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="auth-input-label">Monthly Limit (₹)</label>
                  <input
                    type="number"
                    value={modalLimitInput}
                    onChange={(e) => setModalLimitInput(e.target.value)}
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}
                    placeholder="Enter limit e.g. 12000"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
      </main>
    </div>
  );
};

export default Budgets;
