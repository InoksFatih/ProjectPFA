const ReviewModel = require('../models/ReviewModel');
const pool = require('../config/db'); // ✅ This is missing and causes the crash

// Get all reviews for a product
exports.getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await ReviewModel.getReviewsByProductId(productId);

    // ✅ Always return an array, even if empty
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la récupération des avis" });
  }
};


// Add a new review (only if logged in)
exports.createReview = async (req, res) => {
  const produit_id = req.params.id;
  const client_id = req.user.id; // must come from your authMiddleware
  const { texte, note } = req.body;

  if (!texte || !note) {
    return res.status(400).json({ message: 'Texte et note requis.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO reviews (client_id, produit_id, texte, note) VALUES (?, ?, ?, ?)',
      [client_id, produit_id, texte, note]
    );
    res.status(201).json({ message: 'Avis ajouté avec succès.' });
  } catch (err) {
    console.error('Erreur ajout avis:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// DELETE review
exports.deleteReview = async (req, res) => {
  const clientId = req.user?.id;
  const { reviewId } = req.params;

  if (!clientId) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    const success = await ReviewModel.deleteReviewById(reviewId, clientId);

    if (!success) {
      return res.status(403).json({ message: "Non autorisé ou avis introuvable" });
    }

    res.status(200).json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression de l'avis" });
  }
};

// ✅ FIX: This must NOT be inside the deleteReview block
exports.getMyReviews = async (req, res) => {
  const clientId = req.user?.id;

  if (!clientId) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    const reviews = await ReviewModel.getReviewsByClientId(clientId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching user reviews:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des avis" });
  }
};
