import api from './api';

/**
 * Fetch all available expense categories
 */
export const getCategoriesApi = async () => {
  const response = await api.get('/categories');
  return response.data;
};

/**
 * Fetch personal expenses with optional query filters
 * @param {Object} params { category_id, start_date, end_date, search }
 */
export const getExpensesApi = async (params = {}) => {
  const response = await api.get('/expenses', { params });
  return response.data;
};

/**
 * Fetch single expense by ID
 */
export const getExpenseByIdApi = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

/**
 * Create new personal expense
 */
export const createExpenseApi = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

/**
 * Update personal expense (PATCH)
 */
export const updateExpenseApi = async (id, expenseData) => {
  const response = await api.patch(`/expenses/${id}`, expenseData);
  return response.data;
};

/**
 * Delete personal expense
 */
export const deleteExpenseApi = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};
