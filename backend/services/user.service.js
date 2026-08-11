const { pool } = require('../config/db');

/**
 * User Service - Handles raw database operations for Users table
 */

/**
 * Create a new user with parameterized query
 */
const createUser = async ({ name, email, passwordHash }) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [name.trim(), email.toLowerCase().trim(), passwordHash]);
  
  return {
    id: result.insertId,
    name: name.trim(),
    email: email.toLowerCase().trim()
  };
};

/**
 * Find user by email (includes password_hash for authentication internal verification)
 */
const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password_hash, created_at, updated_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [email.toLowerCase().trim()]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Find user by ID (EXCLUDES password_hash for safe user profile responses)
 */
const findUserById = async (id) => {
  const query = `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
