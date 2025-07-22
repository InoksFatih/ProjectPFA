const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/auth');

// ✅ Safe, non-conflicting routes
router.get('/product/:productId', reviewController.getReviewsForProduct); // ← FIXED
router.get('/my-reviews', verifyToken, reviewController.getMyReviews);
router.post('/product/:id', verifyToken, reviewController.createReview);
router.delete('/:reviewId', verifyToken, reviewController.deleteReview);

module.exports = router;
