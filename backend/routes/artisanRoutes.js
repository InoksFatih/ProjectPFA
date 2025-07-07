const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisanController');
const verifyToken = require('../middleware/auth');

// Artisan profile
router.get('/profile/:userId', artisanController.getArtisanByUserId);
router.put('/profile/:userId', verifyToken, artisanController.updateArtisan);

// Artisan boutique
router.post('/boutique', verifyToken, artisanController.createBoutique);

// Artisan products
router.get('/produits/:userId', artisanController.getArtisanProducts);
router.post('/produits', verifyToken, artisanController.addProduct);
router.put('/produits/:id', verifyToken, artisanController.updateProduct);
router.delete('/produits/:id', verifyToken, artisanController.deleteProduct);

// Product images
router.get('/produits/:productId/images', artisanController.getProductImages);
router.post('/produits/:productId/images', verifyToken, artisanController.addProductImage);
router.delete('/produits/images/:imageId', verifyToken, artisanController.deleteProductImage);

module.exports = router;
