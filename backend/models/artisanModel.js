const db = require('../config/db');

const ArtisanModel = {
  // 🔍 Get artisan row by user ID
  getByUserId: async (userId) => {
    const [rows] = await db.query('SELECT * FROM artisans WHERE user_id = ?', [userId]);
    return rows[0];
  },

  // ✏️ Update artisan profile info (bio, bankInfo, numeroTelephone, etc.)
  updateProfile: async (userId, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(userId);

    const [result] = await db.query(
      `UPDATE artisans SET ${fields} WHERE user_id = ?`,
      values
    );
    return result;
  },

  // 🏬 Get the artisan's boutique (if exists)
  getBoutique: async (userId) => {
    const [rows] = await db.query(
      `SELECT b.* FROM boutiques b
       JOIN artisans a ON a.id = b.artisan_id
       WHERE a.user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  // ➕ Create a boutique for an artisan
  createBoutique: async (userId, { nom, description }) => {
    // First, get artisan's internal ID
    const [artisanRows] = await db.query(
      'SELECT id FROM artisans WHERE user_id = ?',
      [userId]
    );
    const artisanId = artisanRows[0]?.id;

    if (!artisanId) {
      throw new Error("Artisan not found.");
    }

    const [result] = await db.query(
      `INSERT INTO boutiques (nom, description, artisan_id)
       VALUES (?, ?, ?)`,
      [nom, description, artisanId]
    );

    return result.insertId;
  },

  // 🧾 Get all products in the artisan’s boutique
  getProducts: async (userId) => {
    const [rows] = await db.query(
      `SELECT p.* FROM produits p
       JOIN boutiques b ON b.id = p.boutique_id
       JOIN artisans a ON a.id = b.artisan_id
       WHERE a.user_id = ?`,
      [userId]
    );
    return rows;
  },

  // 📦 Get artisan’s commandes (purchases made for their products)
  getPurchases: async (userId) => {
    const [rows] = await db.query(
      `SELECT c.*, cp.produit_id, cp.quantite, cp.total, u.login AS client_login
       FROM commandes c
       JOIN commande_produits cp ON c.id = cp.commande_id
       JOIN produits p ON p.id = cp.produit_id
       JOIN boutiques b ON p.boutique_id = b.id
       JOIN artisans a ON b.artisan_id = a.id
       JOIN users u ON u.id = c.client_id
       WHERE a.user_id = ?`,
      [userId]
    );
    return rows;
  }
};

module.exports = ArtisanModel;
