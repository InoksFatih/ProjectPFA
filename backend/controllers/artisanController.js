const ArtisanModel = require('../models/artisanModel');
const ProduitModel = require('../models/produitModel');

// ✅ Get artisan profile by user ID
exports.getArtisanByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const artisan = await ArtisanModel.getByUserId(userId);
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }
    res.status(200).json(artisan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Update artisan profile
exports.updateArtisan = async (req, res) => {
  const userId = req.params.userId;
  const { nom, prenom, bio, bankInfo, numeroTelephone } = req.body;

  try {
    await ArtisanModel.updateProfile(userId, { nom, prenom, bio, bankInfo, numeroTelephone });
    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};

// ✅ Get all products for an artisan
exports.getArtisanProducts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const products = await ArtisanModel.getProducts(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur produits artisan :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Create boutique (1:1)
exports.createBoutique = async (req, res) => {
  const userId = req.user.id;
  const { nom, description } = req.body;

  try {
    const boutiqueId = await ArtisanModel.createBoutique(userId, { nom, description });
    res.status(201).json({ message: 'Boutique créée', boutiqueId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la boutique' });
  }
};

// ✅ Add product
exports.addProduct = async (req, res) => {
  const { titre, description, prix, stock, boutique_id } = req.body;

  if (!titre || !prix || !boutique_id) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    const productId = await ProduitModel.add({ titre, description, prix, stock: stock || 0, boutique_id });
    res.status(201).json({ message: 'Produit ajouté avec succès', productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du produit' });
  }
};

// ✅ Update product
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
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
};

// ✅ Delete product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await ProduitModel.delete(productId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};

// ✅ Get product images
exports.getProductImages = async (req, res) => {
  const productId = req.params.productId;

  try {
    const images = await ProduitModel.getImages(productId);
    res.status(200).json(images);
  } catch (err) {
    console.error('Erreur images produit :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Add product image
exports.addProductImage = async (req, res) => {
  const productId = req.params.productId;
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ message: 'Image URL requise' });
  }

  try {
    const imageId = await ProduitModel.addImage(productId, image_url);
    res.status(201).json({ message: 'Image ajoutée', imageId });
  } catch (err) {
    console.error('Erreur ajout image :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Delete product image
exports.deleteProductImage = async (req, res) => {
  const imageId = req.params.imageId;

  try {
    const result = await ProduitModel.deleteImage(imageId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image introuvable' });
    }

    res.status(200).json({ message: 'Image supprimée' });
  } catch (err) {
    console.error('Erreur suppression image :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
