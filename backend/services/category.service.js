const { pool } = require('../config/db');

/**
 * Get all available categories
 */
const getAllCategories = async () => {
  const query = `
    SELECT id, name, created_at
    FROM categories
    ORDER BY name ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

/**
 * Check if category exists
 */
const getCategoryById = async (id) => {
  const query = `
    SELECT id, name
    FROM categories
    WHERE id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  getAllCategories,
  getCategoryById
};
