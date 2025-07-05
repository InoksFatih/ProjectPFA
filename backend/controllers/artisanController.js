const db = require('../config/db');

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
    const [artisanRows] = await db.query('SELECT id FROM artisans WHERE user_id = ?', [userId]);
    if (artisanRows.length === 0) {
      return res.status(404).json({ message: "Artisan not found." });
    }

    const artisanId = artisanRows[0].id;

    const [products] = await db.query('SELECT * FROM produits WHERE boutique_id IN (SELECT id FROM boutiques WHERE artisan_id = ?)', [artisanId]);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching artisan products:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Create boutique (1:1)
exports.createBoutique = async (req, res) => {
  const userId = req.user.id;  // user ID from JWT
  const { nom, localisation, description } = req.body;

  try {
    const [artisan] = await db.query('SELECT id FROM artisans WHERE user_id = ?', [userId]);
    if (artisan.length === 0) {
      return res.status(404).json({ message: 'Artisan non trouvé' });
    }

    const artisanId = artisan[0].id;

    await db.query(
      'INSERT INTO boutiques (nom, localisation, description, artisan_id) VALUES (?, ?, ?, ?)',
      [nom, localisation, description, artisanId]
    );

    res.status(201).json({ message: 'Boutique créée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de la boutique' });
  }
};


// Add product to boutique
exports.addProduct = async (req, res) => {
  const { titre, description, prix, stock, boutique_id } = req.body;

  if (!titre || !prix || !boutique_id) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    // Confirm boutique exists
    const [boutiqueRows] = await db.query('SELECT * FROM boutiques WHERE id = ?', [boutique_id]);
    if (boutiqueRows.length === 0) {
      return res.status(404).json({ message: 'Boutique introuvable' });
    }

    // Insert product
    await db.query(
      `INSERT INTO produits (titre, description, prix, stock, boutique_id)
       VALUES (?, ?, ?, ?, ?)`,
      [titre, description, prix, stock || 0, boutique_id]
    );

    res.status(201).json({ message: 'Produit ajouté avec succès' });
  } catch (err) {
    console.error('Erreur SQL:', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
  }
};


exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { titre, description, prix } = req.body;

  if (!titre || !prix) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  try {
    const [result] = await db.query(
      `UPDATE produits 
       SET titre = ?, description = ?, prix = ?
       WHERE id = ?`,
      [titre, description, prix || 0, productId]
    );

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
    const [result] = await db.query('DELETE FROM produits WHERE id = ?', [productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur SQL:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};
