/**
 * Expense Validation Utilities
 */

const validateExpenseInput = ({ category_id, amount, expense_date, description }) => {
  const errors = [];

  // 1. Category ID check
  const catId = Number(category_id);
  if (!category_id || isNaN(catId) || catId <= 0) {
    errors.push('Valid category_id is required.');
  }

  // 2. Amount check
  const numAmount = Number(amount);
  if (amount === undefined || amount === null || isNaN(numAmount) || numAmount <= 0) {
    errors.push('Amount must be a number greater than 0.');
  }

  // 3. Expense date check
  if (!expense_date || typeof expense_date !== 'string') {
    errors.push('Valid expense_date is required.');
  } else {
    const dateObj = new Date(expense_date);
    if (isNaN(dateObj.getTime())) {
      errors.push('expense_date must be a valid date format (YYYY-MM-DD).');
    }
  }

  // 4. Description check
  if (description && typeof description === 'string' && description.length > 255) {
    errors.push('Description cannot exceed 255 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateExpenseInput
};
