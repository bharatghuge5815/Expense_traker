import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummaryApi } from '../services/dashboard.api';
import SummaryCard from '../components/dashboard/SummaryCard';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import RecentExpenses from '../components/dashboard/RecentExpenses';

const Dashboard = () => {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div className="status-badge loading" style={{ display: 'inline-flex' }}>
          <span className="dot loading"></span>
          Loading dashboard summary...
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

  // Zero State (Empty State)
  const isEmpty = !data || data.expense_count === 0;

  return (
    <div>
      {/* Header Greeting Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            Hello, {user?.name || 'User'} 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Here is your financial spending overview
          </p>
        </div>
        <Link
          to="/expenses"
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          + Add Expense
        </Link>
      </div>

      {isEmpty ? (
        /* Clean Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No expenses yet
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            Start tracking your spending by adding your first expense.
          </p>
          <Link
            to="/expenses"
            style={{
              display: 'inline-block',
              padding: '0.85rem 1.5rem',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Add Your First Expense
          </Link>
        </div>
      ) : (
        <>
          {/* 4 Key Summary Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <SummaryCard
              title="Total Expenses"
              value={data.total_expenses}
              icon="💰"
              accentColor="#6366f1"
            />
            <SummaryCard
              title="This Month"
              value={data.this_month}
              icon="📅"
              accentColor="#a855f7"
            />
            <SummaryCard
              title="Today's Expenses"
              value={data.today}
              icon="⚡"
              accentColor="#10b981"
            />
            <SummaryCard
              title="Transactions"
              value={data.expense_count}
              icon="📝"
              accentColor="#3b82f6"
              isCount={true}
            />
          </div>

          {/* Breakdown & Recent Activity Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem'
          }}>
            <CategoryBreakdown
              categoryBreakdown={data.category_breakdown}
              totalExpenses={data.total_expenses}
            />
            <RecentExpenses
              recentExpenses={data.recent_expenses}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
