const pool = require('../config/db');

// Get all reviews for a specific product
async function getReviewsByProductId(productId) {
  const [rows] = await pool.query(
    `SELECT r.*, c.nom AS client_nom
     FROM reviews r
     JOIN clients c ON r.client_id = c.user_id
     WHERE r.produit_id = ?`,
    [productId]
  );
  return rows;
}

// Add a new review
async function addReview({ client_id, produit_id, texte, note }) {
  const [result] = await pool.query(
    `INSERT INTO reviews (client_id, produit_id, texte, note)
     VALUES (?, ?, ?, ?)`,
    [client_id, produit_id, texte, note]
  );
  return result.insertId;
}

// Delete a review
async function deleteReviewById(reviewId, clientId) {
  const [result] = await pool.query(
    `DELETE FROM reviews WHERE id = ? AND client_id = ?`,
    [reviewId, clientId]
  );
  return result.affectedRows > 0;
}

// Get all reviews submitted by a client
async function getReviewsByClientId(clientId) {
  const [rows] = await pool.query(
    `SELECT r.*, p.titre AS produit_titre
     FROM reviews r
     JOIN produits p ON r.produit_id = p.id
     WHERE r.client_id = ?`,
    [clientId]
  );
  return rows;
}

module.exports = {
  getReviewsByProductId,
  addReview,
  deleteReviewById,
  getReviewsByClientId,
};
