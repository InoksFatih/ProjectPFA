const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisanController');
const verifyToken = require('../middleware/auth');
const { diskUpload } = require('../middleware/upload');

// Artisan profile
router.get('/profile/:userId', artisanController.getArtisanByUserId);
router.put('/profile/:userId', verifyToken, artisanController.updateArtisan);
router.get('/produits/marketplace', artisanController.getAllProductsForMarketplace);

// Artisan boutique
router.post('/boutique', verifyToken, artisanController.createBoutique);

// Artisan products
router.get('/produits/:userId', artisanController.getArtisanProducts);
router.post('/produits',  artisanController.addProduct);
router.put('/produits/:id', verifyToken, artisanController.updateProduct);
router.delete('/produits/:id', verifyToken, artisanController.deleteProduct);


// Product images
router.get('/produits/:productId/images', artisanController.getProductImages);
router.post(
  '/produits/:productId/images',
  verifyToken,
  diskUpload.array('images', 5), // key name must match Postman exactly
  artisanController.addProductImagesFromUpload
);
router.delete('/produits/images/:imageId', verifyToken, artisanController.deleteProductImage);
router.get('/produit/:id', artisanController.getSingleProductWithImages);

module.exports = router;
