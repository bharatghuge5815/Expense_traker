const categoryService = require('../services/category.service');

/**
 * Get all available categories
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories
};
