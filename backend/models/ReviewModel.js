const pool = require('../config/db');

async function getReviewsByProductId(productId) {
  const [rows] = await pool.query(
    `SELECT r.*, u.login AS user_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.produit_id = ?`,
    [productId]
  );
  return rows;
}

async function addReview({ user_id, produit_id, texte, note }) {
  const [result] = await pool.query(
    `INSERT INTO reviews (user_id, produit_id, texte, note)
     VALUES (?, ?, ?, ?)`,
    [user_id, produit_id, texte, note]
  );
  return result.insertId;
}

async function deleteReviewById(reviewId, userId) {
  const [result] = await pool.query(
    `DELETE FROM reviews WHERE id = ? AND user_id = ?`,
    [reviewId, userId]
  );
  return result.affectedRows > 0;
}

async function getReviewsByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT r.*, p.titre AS produit_titre
     FROM reviews r
     JOIN produits p ON r.produit_id = p.id
     WHERE r.user_id = ?`,
    [userId]
  );
  return rows;
}

module.exports = {
  getReviewsByProductId,
  addReview,
  deleteReviewById,
  getReviewsByUserId,
};
