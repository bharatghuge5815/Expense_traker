import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const totalExp = data?.total_expenses || 23650;
  const income = 72300;
  const totalBalance = 48650;
  const savings = 24650;

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
              📅 May 2025 ˅
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
              Loading dashboard analytics...
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
            {/* Top Row: 4 Metric Cards */}
            <div className="dashboard-grid-4">
              <SummaryCard
                title="Total Balance"
                value={totalBalance}
                icon="👛"
                trend="12.5% vs last month"
                iconBg="#dcfce7"
                iconColor="#16a34a"
              />
              <SummaryCard
                title="Total Income"
                value={income}
                icon="⬇️"
                trend="8.3% vs last month"
                iconBg="#dcfce7"
                iconColor="#16a34a"
              />
              <SummaryCard
                title="Total Expenses"
                value={totalExp}
                icon="⬆️"
                trend="15.7% vs last month"
                isNegative={true}
                iconBg="#fee2e2"
                iconColor="#ef4444"
              />
              <SummaryCard
                title="Savings"
                value={savings}
                icon="🐷"
                trend="10.2% vs last month"
                iconBg="#dbeafe"
                iconColor="#2563eb"
              />
            </div>

            {/* Middle Row: Overview Chart + Category Donut Chart */}
            <div className="dashboard-grid-2" style={{ marginBottom: '1.5rem' }}>
              <ExpenseOverviewChart recentExpenses={data?.recent_expenses || []} />
              <CategoryDonutChart
                categoryBreakdown={data?.category_breakdown || []}
                totalExpenses={data?.total_expenses || 0}
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
                    Great job!
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    You've spent 15.7% less than last month. Keep it up and save more!
                  </p>
                </div>
              </div>

              <button
                className="btn-view-reports"
                onClick={() => alert('Financial reports generated.')}
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
