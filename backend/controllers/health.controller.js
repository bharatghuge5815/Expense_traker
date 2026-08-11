/**
 * Health check controller
 * GET /api/health
 */
const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker API is running'
  });
};

module.exports = {
  getHealthStatus
};
