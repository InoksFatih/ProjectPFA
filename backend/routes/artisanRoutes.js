const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisanController');
const verifyToken = require('../middleware/auth'); // 👈 import middleware

// Public routes
router.get('/profile/:userId', artisanController.getArtisanByUserId);
router.get('/produits/:userId', artisanController.getArtisanProducts);

// Protected routes
router.put('/profile/:userId', verifyToken, artisanController.updateArtisan);
router.post('/boutique', verifyToken, artisanController.createBoutique);
router.post('/produits', verifyToken, artisanController.addProduct);
router.put('/produits/:id', verifyToken, artisanController.updateProduct);
router.delete('/produits/:id', verifyToken, artisanController.deleteProduct);

module.exports = router;
