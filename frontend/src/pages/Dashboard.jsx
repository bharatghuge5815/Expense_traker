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

  // Period Filter State: THIS_MONTH, LAST_MONTH, THIS_YEAR, ALL_TIME
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH');

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

  // Filter raw recent expenses by selected date period
  const rawExpenses = data?.recent_expenses || [];
  const filteredExpenses = rawExpenses.filter((item) => {
    if (!item.expense_date) return true;
    const itemDate = new Date(item.expense_date);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (selectedPeriod === 'THIS_MONTH') {
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    }
    if (selectedPeriod === 'LAST_MONTH') {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return itemDate.getFullYear() === lastMonthYear && itemDate.getMonth() === lastMonth;
    }
    if (selectedPeriod === 'THIS_YEAR') {
      return itemDate.getFullYear() === currentYear;
    }
    return true; // ALL_TIME
  });

  // Calculate dynamic totals for selected period
  const periodExpensesSum = filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const displayTotalExpenses = periodExpensesSum > 0 ? periodExpensesSum : Number(data?.total_expenses || 0);
  const thisMonthValue = Number(data?.this_month || periodExpensesSum || 0);
  const totalIncome = 72300;
  const netSavings = Math.max(0, totalIncome - displayTotalExpenses);

  // Compute dynamic category breakdown for selected period
  const periodCategoryMap = {};
  filteredExpenses.forEach(item => {
    const cat = item.category_name || 'Other';
    periodCategoryMap[cat] = (periodCategoryMap[cat] || 0) + Number(item.amount || 0);
  });

  const periodCategoryBreakdown = Object.keys(periodCategoryMap).length > 0
    ? Object.keys(periodCategoryMap).map(cat => ({ category: cat, amount: periodCategoryMap[cat] }))
    : data?.category_breakdown || [];

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
              Here's what's happening with your finances today.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Interactive "This Month" Date Filter Dropdown */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="date-filter-pill"
              style={{ outline: 'none', cursor: 'pointer' }}
            >
              <option value="THIS_MONTH">📅 This Month</option>
              <option value="LAST_MONTH">📅 Last Month</option>
              <option value="THIS_YEAR">📅 This Year</option>
              <option value="ALL_TIME">📅 All Time</option>
            </select>

            <button className="btn-add-expense" onClick={() => navigate('/add-expense')}>
              + Add Expense
            </button>
          </div>
        </div>

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
            {/* Top Row: 4 Metric Cards Filtered by Period */}
            <div className="dashboard-grid-4">
              <SummaryCard
                title="Total Income"
                value={totalIncome}
                icon="⬇️"
                trend="8.3% vs last month"
                iconBg="#dcfce7"
                iconColor="#16a34a"
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
                title="This Period"
                value={thisMonthValue}
                icon="📅"
                trend={selectedPeriod.replace('_', ' ')}
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
                    Financial Insight ({selectedPeriod.replace('_', ' ')})
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Showing metrics for {selectedPeriod.toLowerCase().replace('_', ' ')}. Keep tracking to save more!
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
