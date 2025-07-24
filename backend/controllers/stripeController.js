const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PanierModel = require('../models/PanierModel');

const stripeController = {
  async createCheckoutSession(req, res) {
    try {
      const userId = req.user.id; // From JWT
      const cartItems = await PanierModel.getCartItems(userId);

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Panier vide' });
      }

     const lineItems = cartItems.map(item => {
  return {
    price_data: {
      currency: 'mad',
      product_data: {
        name: item.nom || 'Produit inconnu', 
      },
      unit_amount: Math.round(item.prix * 100),
    },
    quantity: item.quantite,
  };
});


      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: 'http://localhost:5173/success',
        cancel_url: 'http://localhost:5173/cancel',
      });

      res.json({ url: session.url });

    } catch (err) {
      console.error('Stripe Checkout Error:', err);
      res.status(500).json({ message: 'Erreur lors de la création de la session Stripe' });
    }
  }
};

module.exports = stripeController;
