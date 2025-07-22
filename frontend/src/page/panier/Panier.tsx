import React, { useEffect, useState } from 'react';
import './Panier.css';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

interface Product {
  id: number;
  titre: string;
  prix: number;
  quantite: number;
  image_url: string;
}

const Panier: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const token = localStorage.getItem('token');
  const { refreshCartCount } = useCart();

  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return '/default.jpg';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const fetchPanier = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/panier', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
      updateTotal(res.data);
      refreshCartCount(); // ensure sync on load
    } catch (err) {
      console.error('🔴 Failed to load cart:', err);
    }
  };

  const updateTotal = (products: Product[]) => {
    const sum = products.reduce((acc, item) => acc + item.prix * item.quantite, 0);
    setTotal(sum);
  };

  const handleQuantityChange = async (produit_id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await axios.put('http://localhost:5000/api/panier/update', {
        produit_id,
        quantite: newQty,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = items.map(item =>
        item.id === produit_id ? { ...item, quantite: newQty } : item
      );
      setItems(updated);
      updateTotal(updated);
      refreshCartCount(); // 🔄 sync with header
    } catch (err) {
      console.error('🔴 Failed to update quantity:', err);
    }
  };

  const handleDelete = async (produit_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/panier/supprimer/${produit_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = items.filter(item => item.id !== produit_id);
      setItems(filtered);
      updateTotal(filtered);
      refreshCartCount(); // 🔄 sync with header
    } catch (err) {
      console.error('🔴 Failed to delete item:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      let url = '';
      if (selectedPayment === 'stripe') {
        const res = await axios.post(
          'http://localhost:5000/api/stripe/create-checkout-session',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        url = res.data.url;
      } else if (selectedPayment === 'paypal') {
        const res = await axios.post('http://localhost:5000/api/paypal/create-paypal-order', {}, {
  headers: { Authorization: `Bearer ${token}` },
});

        url = res.data.url;
      } else {
        alert("Cette méthode de paiement n'est pas encore disponible.");
        return;
      }

      window.location.href = url;
    } catch (err) {
      console.error('Erreur lors du checkout:', err);
      alert('Erreur lors de la redirection vers la page de paiement.');
    }
  };

  useEffect(() => {
    fetchPanier();
  }, []);

  return (
    <div className="panier-container">
      <div className="panier-items">
        <h2>Panier</h2>
        {items.length === 0 ? (
          <p className="empty-message">Votre panier est vide.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="panier-item">
              <img src={getImageUrl(item.image_url)} alt={item.titre} />
              <div className="item-info">
                <h4>{item.titre}</h4>
                <p>{item.prix} MAD</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, item.quantite - 1)}>-</button>
                  <span>{item.quantite}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantite + 1)}>+</button>
                </div>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑</button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="panier-summary">
          <h3>Résumé de la commande</h3>
          <p>Sous-total: {total} MAD</p>
          <p>Livraison: <strong>Gratuit</strong></p>
          <hr />
          <p><strong>Total: {total} MAD</strong></p>

          <div className="payment-methods">
            <h4>Méthode de paiement</h4>
            <label>
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={selectedPayment === 'stripe'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              /> Carte Banquaire
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={selectedPayment === 'paypal'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              /> PayPal
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cmi"
                checked={selectedPayment === 'cmi'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              /> CMI
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedPayment === 'cod'}
                onChange={(e) => setSelectedPayment(e.target.value)}
              /> Paiement à la livraison
            </label>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
};

export default Panier;
