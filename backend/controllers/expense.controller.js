const expenseService = require('../services/expense.service');
const categoryService = require('../services/category.service');
const { validateExpenseInput } = require('../utils/expense.validator');

/**
 * Create new expense
 * POST /api/expenses
 */
const createExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, description, expense_date } = req.body;

    // Validate inputs
    const validation = validateExpenseInput({ category_id, amount, expense_date, description });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Verify category exists
    const category = await categoryService.getCategoryById(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category_id. Category does not exist.'
      });
    }

    const expense = await expenseService.createExpense({
      userId,
      categoryId: category_id,
      amount: Number(amount),
      description,
      expenseDate: expense_date
    });

    return res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all expenses belonging to logged-in user with filters
 * GET /api/expenses
 */
const getExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category_id, start_date, end_date, search } = req.query;

    const expenses = await expenseService.getExpenses({
      userId,
      categoryId: category_id ? Number(category_id) : undefined,
      startDate: start_date,
      endDate: end_date,
      search
    });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single expense by ID
 * GET /api/expenses/:id
 */
const getExpenseById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenseId = Number(req.params.id);

    if (isNaN(expenseId) || expenseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    const existing = await expenseService.checkExpenseExists(expenseId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (existing.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this expense'
      });
    }

    const expense = await expenseService.getExpenseById({ userId, expenseId });
    return res.status(200).json({
      success: true,
      expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update expense (PATCH)
 * PATCH /api/expenses/:id
 */
const updateExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenseId = Number(req.params.id);
    const { category_id, amount, description, expense_date } = req.body;

    if (isNaN(expenseId) || expenseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0'
        });
      }
    }

    if (category_id !== undefined) {
      const category = await categoryService.getCategoryById(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category_id. Category does not exist.'
        });
      }
    }

    const updatedExpense = await expenseService.updateExpense({
      userId,
      expenseId,
      categoryId: category_id ? Number(category_id) : undefined,
      amount: amount !== undefined ? Number(amount) : undefined,
      description,
      expenseDate: expense_date
    });

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete expense
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenseId = Number(req.params.id);

    if (isNaN(expenseId) || expenseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    await expenseService.deleteExpense({ userId, expenseId });

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
