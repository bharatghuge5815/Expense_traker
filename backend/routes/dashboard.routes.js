const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware
router.use(authenticateToken);

router.get('/summary', dashboardController.getSummary);

module.exports = router;
