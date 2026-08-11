const { pool } = require('../config/db');

/**
 * Dashboard Service - Parameterized SQL aggregations for user financial metrics
 */

/**
 * Get comprehensive dashboard summary metrics for logged-in user
 */
const getDashboardSummary = async (userId) => {
  // 1. Total expenses & count
  const totalQuery = `
    SELECT 
      COALESCE(SUM(amount), 0) AS total_expenses,
      COUNT(id) AS expense_count
    FROM expenses
    WHERE user_id = ?
  `;
  const [totalRows] = await pool.execute(totalQuery, [userId]);
  const totalExpenses = Number(totalRows[0]?.total_expenses || 0);
  const expenseCount = Number(totalRows[0]?.expense_count || 0);

  // 2. This month expenses (from 1st day of current month)
  const monthQuery = `
    SELECT COALESCE(SUM(amount), 0) AS this_month
    FROM expenses
    WHERE user_id = ? 
      AND expense_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND expense_date <= LAST_DAY(CURDATE())
  `;
  const [monthRows] = await pool.execute(monthQuery, [userId]);
  const thisMonth = Number(monthRows[0]?.this_month || 0);

  // 3. Today's expenses (expense_date = CURDATE())
  const todayQuery = `
    SELECT COALESCE(SUM(amount), 0) AS today
    FROM expenses
    WHERE user_id = ? AND expense_date = CURDATE()
  `;
  const [todayRows] = await pool.execute(todayQuery, [userId]);
  const today = Number(todayRows[0]?.today || 0);

  // 4. Category breakdown (Group by category)
  const categoryQuery = `
    SELECT 
      c.name AS category,
      COALESCE(SUM(e.amount), 0) AS amount
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = ?
    GROUP BY c.id, c.name
    ORDER BY amount DESC
  `;
  const [categoryRows] = await pool.execute(categoryQuery, [userId]);
  const categoryBreakdown = categoryRows.map(row => ({
    category: row.category,
    amount: Number(row.amount || 0)
  }));

  // 5. Recent 5 expenses
  const recentQuery = `
    SELECT 
      e.id,
      e.user_id,
      e.category_id,
      c.name AS category_name,
      e.amount,
      e.description,
      e.expense_date,
      e.created_at
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = ?
    ORDER BY e.expense_date DESC, e.id DESC
    LIMIT 5
  `;
  const [recentRows] = await pool.execute(recentQuery, [userId]);
  const recentExpenses = recentRows.map(row => ({
    ...row,
    amount: Number(row.amount || 0)
  }));

  return {
    total_expenses: totalExpenses,
    this_month: thisMonth,
    today: today,
    expense_count: expenseCount,
    category_breakdown: categoryBreakdown,
    recent_expenses: recentExpenses
  };
};

module.exports = {
  getDashboardSummary
};
