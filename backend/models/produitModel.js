const db = require('../config/db');

const ProduitModel = {
  // 🔍 Get all products for a boutique
  getByBoutiqueId: async (boutiqueId) => {
    const [rows] = await db.query('SELECT * FROM produits WHERE boutique_id = ?', [boutiqueId]);
    return rows;
  },

  // ➕ Add product
  add: async ({ titre, description, prix, stock, boutique_id }) => {
    const [result] = await db.query(
      `INSERT INTO produits (titre, description, prix, stock, boutique_id)
       VALUES (?, ?, ?, ?, ?)`,
      [titre, description, prix, stock, boutique_id]
    );
    return result.insertId;
  },

  // ✏️ Update product
  update: async (id, { titre, description, prix }) => {
    const [result] = await db.query(
      `UPDATE produits SET titre = ?, description = ?, prix = ? WHERE id = ?`,
      [titre, description, prix, id]
    );
    return result;
  },

  // ❌ Delete product
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM produits WHERE id = ?', [id]);
    return result;
  },

  // 📸 IMAGE MANAGEMENT
  getImages: async (produitId) => {
    const [rows] = await db.query(
      `SELECT * FROM product_images WHERE produit_id = ?`,
      [produitId]
    );
    return rows;
  },

  addImage: async (produitId, imageUrl) => {
    const [result] = await db.query(
      `INSERT INTO product_images (produit_id, image_url) VALUES (?, ?)`,
      [produitId, imageUrl]
    );
    return result.insertId;
  },

  deleteImage: async (imageId) => {
    const [result] = await db.query(
      `DELETE FROM product_images WHERE id = ?`,
      [imageId]
    );
    return result;
  },
  
  getByArtisanUserId: async (userId) => {
  const [rows] = await db.query(
    `SELECT p.* FROM produits p
     JOIN boutiques b ON b.id = p.boutique_id
     JOIN artisans a ON a.id = b.artisan_id
     WHERE a.user_id = ?`,
    [userId]
  );
  return rows;
}

};

module.exports = ProduitModel;
