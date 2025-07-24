const db = require('../config/db');

const PanierModel = {
  async getOrCreateCart(userId) {
    const [rows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (rows.length > 0) return rows[0].id;

    const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    return result.insertId;
  },

  async addToCart(cartId, produitId, quantite = 1) {
    const [rows] = await db.query(
      'SELECT id, quantite FROM cart_items WHERE cart_id = ? AND produit_id = ?',
      [cartId, produitId]
    );

    if (rows.length > 0) {
      const newQuantite = rows[0].quantite + quantite;
      await db.query(
        'UPDATE cart_items SET quantite = ? WHERE id = ?',
        [newQuantite, rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, produit_id, quantite) VALUES (?, ?, ?)',
        [cartId, produitId, quantite]
      );
    }
  },

  async getCartItems(userId) {
    const [cartRows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cartRows.length === 0) return [];

    const cartId = cartRows[0].id;
    const [items] = await db.query(`
      SELECT ci.id AS item_id, ci.quantite, p.*, pi.image_url
      FROM cart_items ci
      JOIN produits p ON ci.produit_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.produit_id
      WHERE ci.cart_id = ?
      GROUP BY ci.id
    `, [cartId]);

    return items;
  },

  async updateQuantity(cartId, produitId, quantite) {
    await db.query(
      'UPDATE cart_items SET quantite = ? WHERE cart_id = ? AND produit_id = ?',
      [quantite, cartId, produitId]
    );
  },

  async removeItem(cartId, produitId) {
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND produit_id = ?',
      [cartId, produitId]
    );
  },

  async clearCart(cartId) {
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  },

  async getCartTotal(userId) {
    const [rows] = await db.query(`
      SELECT SUM(p.prix * ci.quantite) AS total
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN produits p ON p.id = ci.produit_id
      WHERE c.user_id = ?
    `, [userId]);

    return rows[0].total || 0;
  },

  async getCartItemCount(userId) {
    const [cartRows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cartRows.length === 0) return 0;

    const cartId = cartRows[0].id;
    const [rows] = await db.query('SELECT SUM(quantite) AS total FROM cart_items WHERE cart_id = ?', [cartId]);

    return rows[0].total || 0;
  }
};

module.exports = PanierModel;
