const PanierModel = require('../models/PanierModel');

const panierController = {
  // GET /api/panier
  async getPanier(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Forbidden: only clients can access the cart' });
      }

      const clientId = req.user.id;
      const items = await PanierModel.getCartItems(clientId);
      res.json(items);
    } catch (err) {
      console.error('❌ getPanier error:', err);
      res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
  },

  // POST /api/panier/ajouter
  async ajouterAuPanier(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Forbidden: only clients can modify the cart' });
      }

      const clientId = req.user.id;
      const { produit_id, quantite } = req.body;

      const cartId = await PanierModel.getOrCreateCart(clientId);
      await PanierModel.addToCart(cartId, produit_id, quantite || 1);

      res.json({ message: 'Produit ajouté au panier' });
    } catch (err) {
      console.error('❌ ajouterAuPanier error:', err);
      res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
  },

  // PUT /api/panier/update
  async updateQuantite(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Forbidden: only clients can modify the cart' });
      }

      const clientId = req.user.id;
      const { produit_id, quantite } = req.body;

      const cartId = await PanierModel.getOrCreateCart(clientId);
      await PanierModel.updateQuantity(cartId, produit_id, quantite);

      res.json({ message: 'Quantité mise à jour' });
    } catch (err) {
      console.error('❌ updateQuantite error:', err);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité' });
    }
  },

  // DELETE /api/panier/supprimer/:produit_id
  async supprimerProduit(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Forbidden: only clients can modify the cart' });
      }

      const clientId = req.user.id;
      const produitId = req.params.produit_id;

      const cartId = await PanierModel.getOrCreateCart(clientId);
      await PanierModel.removeItem(cartId, produitId);

      res.json({ message: 'Produit supprimé du panier' });
    } catch (err) {
      console.error('❌ supprimerProduit error:', err);
      res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
  },

  // GET /api/panier/total
  async getTotal(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Forbidden: only clients can view total' });
      }

      const clientId = req.user.id;
      const total = await PanierModel.getCartTotal(clientId);
      res.json({ total });
    } catch (err) {
      console.error('❌ getTotal error:', err);
      res.status(500).json({ message: 'Erreur lors du calcul du total' });
    }
  },

  // DELETE /api/panier/vider
  async viderPanier(req, res) {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Forbidden: only clients can clear the cart' });
      }

      const clientId = req.user.id;
      const cartId = await PanierModel.getOrCreateCart(clientId);
      await PanierModel.clearCart(cartId);

      res.json({ message: 'Panier vidé' });
    } catch (err) {
      console.error('❌ viderPanier error:', err);
      res.status(500).json({ message: 'Erreur lors du vidage du panier' });
    }
  },

  // GET /api/panier/count
// GET /api/panier/count
async getItemCount(req, res) {
  try {
    console.log('🔍 user:', req.user); // 👈 force log
    if (!req.user || req.user.role?.toLowerCase() !== 'client') {
      console.warn('🛑 Forbidden: role is', req.user?.role);
      return res.status(403).json({ message: 'Forbidden: only clients can access the cart' });
    }

    const userId = req.user.id;
    const count = await PanierModel.getCartItemCount(userId);
    res.status(200).json({ count });
  } catch (err) {
    console.error('❌ getItemCount error:', err.message);
    res.status(500).json({ message: 'Erreur lors du comptage du panier' });
  }
}


};

module.exports = panierController;
