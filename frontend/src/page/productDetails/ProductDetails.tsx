import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import { useCart } from '../../context/CartContext'; // or correct path
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProductImage {
  image_url: string;
}

interface Review {
  id: number;
  client_nom: string;
  texte: string;
  note: number;
  created_at: string;
}

interface Product {
  id: number;
  titre: string;
  description: string;
  prix: number;
  stock: number;
  boutique_nom: string;
  artisan_nom: string;
  artisan_pays: string;
  type_artisanat: string;
  images: ProductImage[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const token = localStorage.getItem('token');
const { refreshCartCount } = useCart();
  useEffect(() => {
    // Fetch product details
    axios.get(`http://localhost:5000/api/artisan/produit/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0].image_url);
        }
      })
      .catch(() => setNotFound(true));

    // Fetch reviews
    axios.get(`http://localhost:5000/api/reviews/product/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [id]);
  
  const handleReviewSubmit = () => {
    if (!newReview || rating < 1) return;

    axios.post(`http://localhost:5000/api/reviews/product/${id}`, {
      texte: newReview,
      note: rating
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      axios.get(`http://localhost:5000/api/reviews/product/${id}`)
        .then((res) => setReviews(res.data));
      setNewReview('');
      setRating(0);
    }).catch(err => {
      console.error('Error posting review:', err);
    });
  };

 const handleAddToCart = async () => {
  if (!token || !product) return;

  try {
    await axios.post('http://localhost:5000/api/panier/ajouter', {
      produit_id: product.id,
      quantite: 1
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    refreshCartCount(); // ✅ Update cart count
    toast.success("Produit ajouté au panier !");
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    toast.error("Erreur lors de l'ajout au panier.");
  }
};


  if (notFound) {
    return (
      <div className="not-found">
        Produit non trouvé. <Link to="/marketplace">Retour au Boutique</Link>.
      </div>
    );
  }

  if (!product) return <div className="loading">Chargement...</div>;

  return (
    <div className="product-details">
      <Link to="/marketplace" className="back-link">← Retour au Boutique</Link>

      <div className="details-content">
        <div className="image-section">
          <img
            src={mainImage ? `http://localhost:5000${mainImage}` : '/default.jpg'}
            alt={product.titre}
            className="main-image"
          />
          {product.images?.length > 1 && (
            <div className="thumbnail-slider">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${img.image_url}`}
                  alt={`Miniature ${index + 1}`}
                  className={`thumbnail ${mainImage === img.image_url ? 'active' : ''}`}
                  onClick={() => setMainImage(img.image_url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <h1>{product.titre}</h1>
          <p className="artisan-name">{product.artisan_nom} ({product.artisan_pays})</p>
          <p className="art-type">{product.type_artisanat}</p>
          <p className="boutique-name">Boutique: {product.boutique_nom}</p>
          <div className="price">{product.prix} MAD</div>
          <div className="tabs">
            <button className="tab active">Description</button>
            <button className="tab">FAQs</button>
            <button className="tab">Customize</button>
          </div>
          <p className="description">{product.description}</p>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Ajouter au panier
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Avis des clients</h3>
        {reviews.length === 0 ? (
          <p>Pas encore d'avis pour ce produit.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <div className="review-avatar-name">
                  <div className="avatar-circle">
                    {r.client_nom?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="review-author">{r.client_nom || 'Utilisateur'}</span>
                </div>
                <div className="review-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < r.note ? '#FFD700' : '#ccc' }}>★</span>
                  ))}
                </div>
              </div>
              <p className="review-text">{r.texte || 'Pas de contenu.'}</p>
              <small className="review-date">
                {r.created_at
                  ? new Date(r.created_at).toLocaleDateString()
                  : 'Date inconnue'}
              </small>
            </div>
          ))
        )}

        {token && (
          <div className="submit-review">
            <h4>Ajouter un avis</h4>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  style={{ cursor: 'pointer', color: s <= rating ? '#FFD700' : '#ccc' }}
                >★</span>
              ))}
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={3}
              placeholder="Écrivez votre avis ici..."
            />
            <button onClick={handleReviewSubmit} className="add-to-cart">Envoyer</button>
          </div>
        )}

        {!token && <p><Link to="/login">Connectez-vous</Link> pour laisser un avis.</p>}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

    </div>
  );
};

export default ProductDetails;
