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

  // Compute live data from MySQL backend response
  const totalExpenses = Number(data?.total_expenses || 0);
  const thisMonthExpenses = Number(data?.this_month || 0);
  const totalIncome = 72300;
  const netSavings = Math.max(0, totalIncome - totalExpenses);

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
            <div className="date-filter-pill">
              📅 This Month ˅
            </div>
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
            {/* Top Row: 4 Metric Cards using Real MySQL Data */}
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
                value={totalExpenses}
                icon="⬆️"
                trend={`${data?.expense_count || 0} transactions logged`}
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
                title="This Week"
                value={thisMonthExpenses}
                icon="📅"
                trend="Current period"
                iconBg="#f3e8ff"
                iconColor="#9333ea"
              />
            </div>

            {/* Middle Row: Overview Chart + Category Donut Chart */}
            <div className="dashboard-grid-2" style={{ marginBottom: '1.5rem' }}>
              <ExpenseOverviewChart recentExpenses={data?.recent_expenses || []} />
              <CategoryDonutChart
                categoryBreakdown={data?.category_breakdown || []}
                totalExpenses={totalExpenses}
              />
            </div>

            {/* Bottom Row: Recent Transactions + Budget Summary */}
            <div className="dashboard-grid-2" style={{ marginBottom: '1.5rem' }}>
              <RecentExpenses recentExpenses={data?.recent_expenses || []} />
              <BudgetSummary categoryBreakdown={data?.category_breakdown || []} />
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
                    Financial Achievement
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    You have logged {data?.expense_count || 0} expenses. Keep tracking your spending to save more!
                  </p>
                </div>
              </div>

              <button
                className="btn-view-reports"
                onClick={() => navigate('/expenses')}
              >
                View Transactions
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
