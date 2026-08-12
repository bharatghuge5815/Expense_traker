import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummaryApi } from '../services/dashboard.api';
import Sidebar from '../components/layout/Sidebar';
import SummaryCard from '../components/dashboard/SummaryCard';
import ExpenseOverviewChart from '../components/dashboard/ExpenseOverviewChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import BudgetSummary from '../components/dashboard/BudgetSummary';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Monthly Income State (persisted to localStorage)
  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem('user_monthly_income');
    return saved ? Number(saved) : 72300;
  });

  // Edit Income Modal State
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');

  // Calendar Month-Year Filter State
  const [selectedMonthYear, setSelectedMonthYear] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getDashboardSummaryApi();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Filter raw expenses by selected Calendar Month & Year
  const rawExpenses = data?.recent_expenses || [];
  const filteredExpenses = rawExpenses.filter((item) => {
    if (!item.expense_date) return true;
    const itemMonthYear = new Date(item.expense_date).toISOString().slice(0, 7);
    return itemMonthYear === selectedMonthYear;
  });

  // Calculate dynamic totals for selected calendar month
  const periodExpensesSum = filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const displayTotalExpenses = periodExpensesSum > 0 ? periodExpensesSum : Number(data?.total_expenses || 0);
  const netSavings = Math.max(0, monthlyIncome - displayTotalExpenses);

  // Formatted display label (e.g. "August 2026")
  const formattedMonthLabel = new Date(`${selectedMonthYear}-01`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Compute dynamic category breakdown for selected calendar month
  const periodCategoryMap = {};
  filteredExpenses.forEach(item => {
    const cat = item.category_name || 'Other';
    periodCategoryMap[cat] = (periodCategoryMap[cat] || 0) + Number(item.amount || 0);
  });

  const periodCategoryBreakdown = Object.keys(periodCategoryMap).length > 0
    ? Object.keys(periodCategoryMap).map(cat => ({ category: cat, amount: periodCategoryMap[cat] }))
    : data?.category_breakdown || [];

  // Edit Income Handlers
  const handleOpenIncomeModal = () => {
    setIncomeInput(monthlyIncome.toString());
    setShowIncomeModal(true);
  };

  const handleSaveIncome = (e) => {
    e.preventDefault();
    const numIncome = Number(incomeInput);
    if (isNaN(numIncome) || numIncome <= 0) {
      alert('Please enter a valid positive income amount.');
      return;
    }

    setMonthlyIncome(numIncome);
    localStorage.setItem('user_monthly_income', numIncome.toString());
    setShowIncomeModal(false);
  };

  return (
    <div className="dashboard-layout-wrapper">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content Area */}
      <main className="dashboard-main-content">
        {/* Top Header Row */}
        <div className="dashboard-top-header">
          <div>
            <h1 className="dashboard-greeting">
              Welcome back, {user?.name || 'Ajinkya'}! 👋
            </h1>
            <p className="dashboard-subgreeting">
              Here's what's happening with your finances in {formattedMonthLabel}.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Clean Calendar Month-Year Picker */}
            <div className="date-filter-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.85rem' }}>
              <span>📅</span>
              <input
                type="month"
                value={selectedMonthYear}
                onChange={(e) => setSelectedMonthYear(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: '#334155',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button className="btn-add-expense" onClick={() => navigate('/add-expense')}>
              + Add Expense
            </button>
          </div>
        </div>

        {/* Edit Monthly Income Modal */}
        {showIncomeModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="dashboard-card" style={{ width: '100%', maxWidth: '420px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                Edit Monthly Income 💵
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Set your expected total monthly income to calculate net savings
              </p>

              <form onSubmit={handleSaveIncome}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="auth-input-label">Monthly Income (₹) *</label>
                  <input
                    type="number"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    placeholder="Enter monthly income e.g. 72300"
                    className="auth-input-field"
                    style={{ paddingLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowIncomeModal(false)}
                    style={{
                      padding: '0.65rem 1.1rem', borderRadius: '8px',
                      border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                      color: '#64748b', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-auth-primary"
                    style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                  >
                    Save Income
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div className="status-badge loading" style={{ display: 'inline-flex' }}>
              <span className="dot loading"></span>
              Loading live dashboard analytics...
            </div>
          </div>
        ) : error ? (
          <div className="dashboard-card">
            <div className="status-badge error" style={{ width: '100%' }}>
              <span className="dot error"></span>
              {error}
            </div>
          </div>
        ) : (
          <>
            {/* Top Row: 4 Metric Cards Filtered by Calendar Month */}
            <div className="dashboard-grid-4">
              <SummaryCard
                title="Total Income"
                value={monthlyIncome}
                icon="⬇️"
                trend="Editable monthly income"
                iconBg="#dcfce7"
                iconColor="#16a34a"
                onEdit={handleOpenIncomeModal}
              />
              <SummaryCard
                title="Total Expenses"
                value={displayTotalExpenses}
                icon="⬆️"
                trend={`${filteredExpenses.length || data?.expense_count || 0} transactions`}
                isNegative={true}
                iconBg="#fee2e2"
                iconColor="#ef4444"
              />
              <SummaryCard
                title="Savings"
                value={netSavings}
                icon="🐷"
                trend="Net balance"
                iconBg="#dbeafe"
                iconColor="#2563eb"
              />
              <SummaryCard
                title="Selected Month"
                value={displayTotalExpenses}
                icon="📅"
                trend={formattedMonthLabel}
                iconBg="#f3e8ff"
                iconColor="#9333ea"
              />
            </div>

            {/* Middle Row: Overview Chart + Category Donut Chart */}
            <div className="dashboard-grid-2" style={{ marginBottom: '1.5rem' }}>
              <ExpenseOverviewChart recentExpenses={filteredExpenses.length > 0 ? filteredExpenses : rawExpenses} />
              <CategoryDonutChart
                categoryBreakdown={periodCategoryBreakdown}
                totalExpenses={displayTotalExpenses}
              />
            </div>

            {/* Bottom Row: Recent Transactions + Budget Summary */}
            <div className="dashboard-grid-2" style={{ marginBottom: '1.5rem' }}>
              <RecentExpenses recentExpenses={filteredExpenses.length > 0 ? filteredExpenses : rawExpenses} />
              <BudgetSummary categoryBreakdown={periodCategoryBreakdown} />
            </div>

            {/* Bottom Insight Banner */}
            <div className="dashboard-bottom-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  📈
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                    Financial Insight ({formattedMonthLabel})
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Net savings: ₹{netSavings.toLocaleString('en-IN')} out of ₹{monthlyIncome.toLocaleString('en-IN')} income.
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
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
