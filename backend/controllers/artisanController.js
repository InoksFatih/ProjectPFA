const db = require('../config/db');
const ProduitModel = require('../models/produitModel');

// Get artisan profile by user ID
exports.getArtisanByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.query(
      'SELECT * FROM artisans WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Update artisan profile
exports.updateArtisan = async (req, res) => {
  const userId = req.params.userId;
  const { nom, prenom, bio, bankInfo, numeroTelephone } = req.body;

  try {
    await db.query(
      `UPDATE artisans 
       SET nom = ?, prenom = ?, bio = ?, bankInfo = ?, numeroTelephone = ? 
       WHERE user_id = ?`,
      [nom, prenom, bio, bankInfo, numeroTelephone, userId]
    );
    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};

// Get all products for an artisan
exports.getArtisanProducts = async (req, res) => {
  const { userId } = req.params;

  try {
    const products = await ProduitModel.getByArtisanUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching artisan products:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Create boutique (1:1)
exports.createBoutique = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query('SELECT id FROM artisans WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const artisanId = rows[0].id;
    const { nom, localisation, description } = req.body;

    await db.query(
      'INSERT INTO boutiques (nom, localisation, description, artisan_id) VALUES (?, ?, ?, ?)',
      [nom, localisation, description, artisanId]
    );

    res.status(201).json({ message: 'Boutique created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating boutique' });
  }
};

// Add product to boutique
exports.addProduct = async (req, res) => {
  const { titre, description, prix, stock, boutique_id } = req.body;

  if (!titre || !prix || !boutique_id) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    const [boutiqueRows] = await db.query('SELECT * FROM boutiques WHERE id = ?', [boutique_id]);
    if (boutiqueRows.length === 0) {
      return res.status(404).json({ message: 'Boutique introuvable' });
    }

    const productId = await ProduitModel.add({ titre, description, prix, stock: stock || 0, boutique_id });
    res.status(201).json({ message: 'Produit ajouté avec succès', productId });
  } catch (err) {
    console.error('Erreur SQL:', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { titre, description, prix } = req.body;

  if (!titre || !prix) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    const result = await ProduitModel.update(productId, { titre, description, prix });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.status(200).json({ message: 'Produit mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur SQL:', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await ProduitModel.delete(productId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur SQL:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};

// Get product images
exports.getProductImages = async (req, res) => {
  const productId = req.params.productId;

  try {
    const images = await ProduitModel.getImages(productId);
    res.status(200).json(images);
  } catch (err) {
    console.error('Error getting product images:', err);
    res.status(500).json({ message: 'Server error while fetching images' });
  }
};

// Add product image
exports.addProductImage = async (req, res) => {
  const { productId } = req.params;
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  try {
    const id = await ProduitModel.addImage(productId, image_url);
    res.status(201).json({ message: 'Image added', imageId: id });
  } catch (err) {
    console.error('Error adding image:', err);
    res.status(500).json({ message: 'Server error while adding image' });
  }
};

// Delete product image
exports.deleteProductImage = async (req, res) => {
  const { imageId } = req.params;

  try {
    const result = await ProduitModel.deleteImage(imageId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: 'Server error while deleting image' });
  }
};
