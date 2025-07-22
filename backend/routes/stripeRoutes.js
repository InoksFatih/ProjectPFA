const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const verifyToken = require('../middleware/auth');

router.post('/create-checkout-session', verifyToken, stripeController.createCheckoutSession);

module.exports = router;
