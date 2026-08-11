/**
 * Utility validators for authentication and inputs
 */

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  return name.trim().length >= 2;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName
};
