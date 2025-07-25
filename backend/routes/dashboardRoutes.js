const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/auth');

router.get('/summary', verifyToken, dashboardController.getDashboardSummary);
router.get('/recent-orders', verifyToken, dashboardController.getRecentOrders);

module.exports = router;
