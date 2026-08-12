import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getExpensesApi } from '../services/expenses.api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const CATEGORY_COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6', '#059669', '#94a3b8'];

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [timePeriod, setTimePeriod] = useState('THIS_MONTH');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await getExpensesApi();
        if (res.success) {
          setExpenses(res.expenses || []);
        }
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Compute category totals
  const categoryTotals = {};
  expenses.forEach((item) => {
    const cat = item.category_name || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount || 0);
  });

  const chartData = Object.keys(categoryTotals).map((catName, idx) => ({
    name: catName,
    amount: categoryTotals[catName],
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
  }));

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => Number(e.amount))) : 0;
  const avgDailySpend = expenses.length > 0 ? Math.round(totalAmount / 30) : 0;

  // Export CSV Handler
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('No expense data available to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Description', 'Category', 'Amount (INR)', 'Payment Method'];
    const rows = expenses.map(e => [
      e.id,
      e.expense_date,
      `"${(e.description || e.category_name).replace(/"/g, '""')}"`,
      `"${(e.category_name || '').replace(/"/g, '""')}"`,
      e.amount,
      e.payment_method || 'UPI'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expense_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-layout-wrapper">
      <Sidebar />

      <main className="dashboard-main-content">
        {/* Top Header */}
        <div className="dashboard-top-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 className="dashboard-greeting">Reports & Analytics</h1>
            <p className="dashboard-subgreeting">
              Analyze financial trends and export custom data reports
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="date-filter-pill"
              style={{ padding: '0.65rem 1rem' }}
            >
              <option value="THIS_MONTH">This Month</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="THIS_YEAR">This Year</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="btn-add-expense"
              style={{ backgroundColor: '#ffffff', color: '#16a34a', border: '1px solid #16a34a', boxShadow: 'none' }}
            >
              📥 Export CSV Report
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="dashboard-grid-4" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <div className="stat-title">Total Spending</div>
            <div className="stat-value">₹ {totalAmount.toLocaleString('en-IN')}</div>
            <div className="stat-trend positive">{expenses.length} transactions logged</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Avg. Daily Spend</div>
            <div className="stat-value">₹ {avgDailySpend.toLocaleString('en-IN')}</div>
            <div className="stat-trend positive">Per day average</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Highest Expense</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>
              ₹ {highestExpense.toLocaleString('en-IN')}
            </div>
            <div className="stat-trend negative">Single transaction peak</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Categories Tracked</div>
            <div className="stat-value">{chartData.length}</div>
            <div className="stat-trend positive">Active categories</div>
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="dashboard-card" style={{ marginBottom: '1.75rem', padding: '1.5rem' }}>
          <h3 className="dashboard-card-title" style={{ marginBottom: '1.25rem' }}>
            Spending Distribution by Category
          </h3>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₹${v >= 1000 ? `${v/1000}K` : v}`} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Category Table */}
        <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h3 className="dashboard-card-title">Category Analytics Summary</h3>
          </div>

          <div className="table-responsive-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Share (%)</th>
                  <th style={{ textAlign: 'right' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item) => {
                  const share = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0;
                  return (
                    <tr key={item.name}>
                      <td style={{ fontWeight: '600', color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                          {item.name}
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontWeight: '500' }}>
                        {share}%
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                        ₹ {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
