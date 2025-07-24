const PanierModel = require('../models/PanierModel');

const panierController = {
  async getPanier(req, res) {
    try {
      const userId = req.user.id;
      const items = await PanierModel.getCartItems(userId);
      res.json(items);
    } catch (err) {
      console.error('❌ getPanier error:', err);
      res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
  },

  async ajouterAuPanier(req, res) {
    try {
      const userId = req.user.id;
      const { produit_id, quantite } = req.body;

      const cartId = await PanierModel.getOrCreateCart(userId);
      await PanierModel.addToCart(cartId, produit_id, quantite || 1);

      res.json({ message: 'Produit ajouté au panier' });
    } catch (err) {
      console.error('❌ ajouterAuPanier error:', err);
      res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
  },

  async updateQuantite(req, res) {
    try {
      const userId = req.user.id;
      const { produit_id, quantite } = req.body;

      const cartId = await PanierModel.getOrCreateCart(userId);
      await PanierModel.updateQuantity(cartId, produit_id, quantite);

      res.json({ message: 'Quantité mise à jour' });
    } catch (err) {
      console.error('❌ updateQuantite error:', err);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité' });
    }
  },

  async supprimerProduit(req, res) {
    try {
      const userId = req.user.id;
      const produitId = req.params.produit_id;

      const cartId = await PanierModel.getOrCreateCart(userId);
      await PanierModel.removeItem(cartId, produitId);

      res.json({ message: 'Produit supprimé du panier' });
    } catch (err) {
      console.error('❌ supprimerProduit error:', err);
      res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
  },

  async getTotal(req, res) {
    try {
      const userId = req.user.id;
      const total = await PanierModel.getCartTotal(userId);
      res.json({ total });
    } catch (err) {
      console.error('❌ getTotal error:', err);
      res.status(500).json({ message: 'Erreur lors du calcul du total' });
    }
  },

  async viderPanier(req, res) {
    try {
      const userId = req.user.id;
      const cartId = await PanierModel.getOrCreateCart(userId);
      await PanierModel.clearCart(cartId);

      res.json({ message: 'Panier vidé' });
    } catch (err) {
      console.error('❌ viderPanier error:', err);
      res.status(500).json({ message: 'Erreur lors du vidage du panier' });
    }
  },

  async getItemCount(req, res) {
    try {
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
