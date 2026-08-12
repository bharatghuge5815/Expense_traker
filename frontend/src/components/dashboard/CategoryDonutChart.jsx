import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS = {
  'Food & Dining': '#16a34a',
  'Food': '#16a34a',
  'Transport': '#3b82f6',
  'Travel': '#3b82f6',
  'Shopping': '#f59e0b',
  'Bills & Utilities': '#a855f7',
  'Bills': '#a855f7',
  'Entertainment': '#ec4899',
  'Education': '#14b8a6',
  'Health': '#10b981',
  'Others': '#94a3b8',
  'Other': '#94a3b8'
};

const DEFAULT_COLOR = '#94a3b8';

const CategoryDonutChart = ({ categoryBreakdown = [], totalExpenses = 0 }) => {
  const chartData = categoryBreakdown.length > 0
    ? categoryBreakdown.map(item => ({
        name: item.category,
        value: Number(item.amount)
      }))
    : [
        { name: 'Food & Dining', value: 8280 },
        { name: 'Transport', value: 4730 },
        { name: 'Shopping', value: 3550 },
        { name: 'Bills & Utilities', value: 2365 },
        { name: 'Entertainment', value: 1890 },
        { name: 'Others', value: 2835 }
      ];

  const currentTotal = totalExpenses > 0
    ? totalExpenses
    : chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Expenses by Category</h3>
        <select className="dashboard-card-select">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '1rem', alignItems: 'center', minHeight: 250 }}>
        {/* Donut Chart Container */}
        <div style={{ position: 'relative', width: '170px', height: '170px', margin: '0 auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLOR}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Donut Label */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
              ₹{currentTotal >= 1000 ? `${(currentTotal/1000).toFixed(1)}k` : currentTotal}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total</div>
          </div>
        </div>

        {/* Right Category Legend Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          {chartData.map((item) => {
            const percent = currentTotal > 0 ? ((item.value / currentTotal) * 100).toFixed(0) : 0;
            const color = CATEGORY_COLORS[item.name] || DEFAULT_COLOR;

            return (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                  <span style={{ color: '#334155', fontWeight: '500' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.85rem', color: '#64748b' }}>
                  <span>{percent}%</span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>
                    ₹{item.value.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryDonutChart;
