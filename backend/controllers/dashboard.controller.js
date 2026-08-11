const dashboardService = require('../services/dashboard.service');

/**
 * Get dashboard summary for authenticated user
 * GET /api/dashboard/summary
 */
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const summary = await dashboardService.getDashboardSummary(userId);

    return res.status(200).json({
      success: true,
      ...summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary
};
