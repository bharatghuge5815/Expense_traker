const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');
const { isValidEmail, isValidPassword, isValidName } = require('../utils/validators');

/**
 * Generate JWT Token for authenticated user
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'expense_tracker_secret_key_2026_super_secure_jwt';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn }
  );
};

/**
 * Register new user service logic
 */
const register = async ({ name, email, password }) => {
  // 1. Validation
  if (!isValidName(name)) {
    const error = new Error('Name must be at least 2 characters long');
    error.status = 400;
    throw error;
  }

  if (!isValidEmail(email)) {
    const error = new Error('Invalid email address format');
    error.status = 400;
    throw error;
  }

  if (!isValidPassword(password)) {
    const error = new Error('Password must be at least 6 characters long');
    error.status = 400;
    throw error;
  }

  // 2. Check for duplicate email
  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email address is already registered');
    error.status = 409;
    throw error;
  }

  // 3. Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 4. Save user to MySQL
  const newUser = await userService.createUser({
    name,
    email,
    passwordHash
  });

  // 5. Generate Token
  const token = generateToken(newUser);

  // 6. Return response (NEVER return password_hash)
  return {
    user: newUser,
    token
  };
};

/**
 * Login user service logic
 */
const login = async ({ email, password }) => {
  // 1. Validation
  if (!isValidEmail(email) || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  // 2. Find user by email
  const user = await userService.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // 3. Compare password hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // 4. Construct clean user object without password_hash
  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at
  };

  // 5. Generate token
  const token = generateToken(userProfile);

  return {
    user: userProfile,
    token
  };
};

module.exports = {
  register,
  login,
  generateToken
};
