const db = require('../config/db');

const PanierModel = {

  // 🔍 Resolve user_id ➜ client_id
  async getClientId(userId) {
  console.log('🟡 Resolving client from user_id:', userId);

  const [clientRows] = await db.query('SELECT id FROM clients WHERE user_id = ?', [userId]);

  if (clientRows.length === 0) {
    console.warn('⚠️ No client found for user:', userId);
    throw new Error('Client not found for this user');
  }

  const clientId = clientRows[0].id;
  console.log('✅ Resolved clientId:', clientId);
  return clientId;
}
,

  // 📦 Get or create a cart for a client
  async getOrCreateCart(userId) {
    const clientId = await this.getClientId(userId);

    const [rows] = await db.query('SELECT id FROM carts WHERE client_id = ?', [clientId]);
    if (rows.length > 0) return rows[0].id;

    const [result] = await db.query('INSERT INTO carts (client_id) VALUES (?)', [clientId]);
    return result.insertId;
  },

  // ➕ Add product to cart
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

  // 🛒 Get all items in user's cart
  async getCartItems(userId) {
    const clientId = await this.getClientId(userId);

    const [cartRows] = await db.query('SELECT id FROM carts WHERE client_id = ?', [clientId]);
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

  // ✏️ Update quantity of a product in cart
  async updateQuantity(cartId, produitId, quantite) {
    await db.query(
      'UPDATE cart_items SET quantite = ? WHERE cart_id = ? AND produit_id = ?',
      [quantite, cartId, produitId]
    );
  },

  // ❌ Remove a product from cart
  async removeItem(cartId, produitId) {
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND produit_id = ?',
      [cartId, produitId]
    );
  },

  // 🧹 Clear cart after checkout
  async clearCart(cartId) {
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  },

  // 💰 Get total cart price
  async getCartTotal(userId) {
    const clientId = await this.getClientId(userId);

    const [rows] = await db.query(`
      SELECT SUM(p.prix * ci.quantite) AS total
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN produits p ON p.id = ci.produit_id
      WHERE c.client_id = ?
    `, [clientId]);

    return rows[0].total || 0;
  },

  // 🔢 Get total item count in cart
  async getCartItemCount(userId) {
  try {
    console.log('🔍 Getting item count for userId:', userId);

    const clientId = await this.getClientId(userId);
    console.log('✅ Resolved clientId:', clientId);

    const [cartRows] = await db.query('SELECT id FROM carts WHERE client_id = ?', [clientId]);
    if (cartRows.length === 0) return 0;

    const cartId = cartRows[0].id;
    const [rows] = await db.query(`SELECT SUM(quantite) AS total FROM cart_items WHERE cart_id = ?`, [cartId]);

    return rows[0].total || 0;
  } catch (err) {
    console.error('🛑 getCartItemCount failed:', err.message);
    throw err; // rethrow to make 500 error happen
  }
}


};

module.exports = PanierModel;
