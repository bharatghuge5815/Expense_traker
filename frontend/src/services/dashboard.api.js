import api from './api';

/**
 * Fetch Dashboard Summary Metrics for logged-in user
 */
export const getDashboardSummaryApi = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};
