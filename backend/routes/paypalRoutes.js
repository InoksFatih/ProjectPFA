const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');
const verifyToken = require('../middleware/auth');

router.post('/create-paypal-order', verifyToken, paypalController.createOrder);

module.exports = router;
