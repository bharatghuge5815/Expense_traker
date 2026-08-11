const { pool } = require('../config/db');

/**
 * Expense Service - Parameterized MySQL database queries with user scoping
 */

/**
 * Create a new personal expense
 */
const createExpense = async ({ userId, categoryId, amount, description, expenseDate }) => {
  const query = `
    INSERT INTO expenses (user_id, category_id, amount, description, expense_date)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    userId,
    categoryId,
    amount,
    description ? description.trim() : null,
    expenseDate
  ]);

  return getExpenseById({ userId, expenseId: result.insertId });
};

/**
 * Get all expenses belonging to logged-in user with optional filters & search
 */
const getExpenses = async ({ userId, categoryId, startDate, endDate, search }) => {
  let query = `
    SELECT 
      e.id,
      e.user_id,
      e.category_id,
      c.name AS category_name,
      e.amount,
      e.description,
      e.expense_date,
      e.created_at,
      e.updated_at
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = ?
  `;

  const params = [userId];

  if (categoryId) {
    query += ` AND e.category_id = ?`;
    params.push(categoryId);
  }

  if (startDate) {
    query += ` AND e.expense_date >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND e.expense_date <= ?`;
    params.push(endDate);
  }

  if (search && search.trim() !== '') {
    query += ` AND (LOWER(e.description) LIKE ? OR LOWER(c.name) LIKE ?)`;
    const searchPattern = `%${search.trim().toLowerCase()}%`;
    params.push(searchPattern, searchPattern);
  }

  query += ` ORDER BY e.expense_date DESC, e.id DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
};

/**
 * Get single expense by ID (must belong to userId)
 */
const getExpenseById = async ({ userId, expenseId }) => {
  const query = `
    SELECT 
      e.id,
      e.user_id,
      e.category_id,
      c.name AS category_name,
      e.amount,
      e.description,
      e.expense_date,
      e.created_at,
      e.updated_at
    FROM expenses e
    JOIN categories c ON e.category_id = c.id
    WHERE e.id = ? AND e.user_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [expenseId, userId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Check if expense exists in database (regardless of ownership, for 403 vs 404 distinction)
 */
const checkExpenseExists = async (expenseId) => {
  const query = `SELECT id, user_id FROM expenses WHERE id = ? LIMIT 1`;
  const [rows] = await pool.execute(query, [expenseId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Update personal expense (PATCH)
 */
const updateExpense = async ({ userId, expenseId, categoryId, amount, description, expenseDate }) => {
  // First check existence & ownership
  const existing = await checkExpenseExists(expenseId);
  if (!existing) {
    const error = new Error('Expense not found');
    error.status = 404;
    throw error;
  }

  if (existing.user_id !== userId) {
    const error = new Error('Forbidden: You do not have permission to modify this expense');
    error.status = 403;
    throw error;
  }

  // Build dynamic update query
  const updates = [];
  const params = [];

  if (categoryId !== undefined) {
    updates.push('category_id = ?');
    params.push(categoryId);
  }
  if (amount !== undefined) {
    updates.push('amount = ?');
    params.push(amount);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description ? description.trim() : null);
  }
  if (expenseDate !== undefined) {
    updates.push('expense_date = ?');
    params.push(expenseDate);
  }

  if (updates.length === 0) {
    return getExpenseById({ userId, expenseId });
  }

  params.push(expenseId, userId);
  const query = `
    UPDATE expenses
    SET ${updates.join(', ')}
    WHERE id = ? AND user_id = ?
  `;

  await pool.execute(query, params);
  return getExpenseById({ userId, expenseId });
};

/**
 * Delete personal expense
 */
const deleteExpense = async ({ userId, expenseId }) => {
  const existing = await checkExpenseExists(expenseId);
  if (!existing) {
    const error = new Error('Expense not found');
    error.status = 404;
    throw error;
  }

  if (existing.user_id !== userId) {
    const error = new Error('Forbidden: You do not have permission to delete this expense');
    error.status = 403;
    throw error;
  }

  const query = `DELETE FROM expenses WHERE id = ? AND user_id = ?`;
  await pool.execute(query, [expenseId, userId]);
  return true;
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  checkExpenseExists,
  updateExpense,
  deleteExpense
};
