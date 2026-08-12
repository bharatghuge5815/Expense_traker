import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyOverviewData = [
  { day: '1 May', amount: 3500 },
  { day: '8 May', amount: 7200 },
  { day: '15 May', amount: 8950 },
  { day: '22 May', amount: 11200 },
  { day: '31 May', amount: 17800 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '0.5rem 0.85rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: '700', color: '#16a34a', fontSize: '0.95rem' }}>
          ₹{payload[0].value.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</div>
      </div>
    );
  }
  return null;
};

const ExpenseOverviewChart = ({ recentExpenses = [] }) => {
  // Construct chart data points from real expenses or overview curve
  const chartData = recentExpenses.length > 0
    ? [...recentExpenses].reverse().map((e, idx) => ({
        day: new Date(e.expense_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        amount: Number(e.amount)
      }))
    : dummyOverviewData;

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Expense Overview</h3>
        <select className="dashboard-card-select">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₹${v >= 1000 ? `${v/1000}K` : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#16a34a"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
              dot={{ r: 4, fill: '#16a34a', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseOverviewChart;
