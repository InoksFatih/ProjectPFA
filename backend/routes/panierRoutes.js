const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panierController');
const verifyToken = require('../middleware/auth'); // your JWT middleware

// 🔐 Get all cart items for the logged-in client
router.get('/', verifyToken, panierController.getPanier);

// ➕ Add a product to the cart
router.post('/ajouter', verifyToken, panierController.ajouterAuPanier);

// 🔁 Update the quantity of a product in the cart
router.put('/update', verifyToken, panierController.updateQuantite);

router.get('/count', verifyToken, panierController.getItemCount);

// ❌ Remove a product from the cart
router.delete('/supprimer/:produit_id', verifyToken, panierController.supprimerProduit);

// 💰 Get total cart price
router.get('/total', verifyToken, panierController.getTotal);

// 🧹 Clear the entire cart
router.delete('/vider', verifyToken, panierController.viderPanier);

module.exports = router;
