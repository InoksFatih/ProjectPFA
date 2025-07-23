import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import artisanImage from '../../assets/artisan.jpg';
import cat1 from '../../assets/cat-1.jpg';
import cat2 from '../../assets/cat-2.jpg';
import cat3 from '../../assets/cat-3.jpg';
import cat4 from '../../assets/cat-4.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();
const categories = [
  { title: 'Poterie', img: cat1 },
  { title: 'Textiles', img: cat2 },
  { title: 'Sculpture sur bois', img: cat3 },
  { title: 'Cuir', img: cat4 }
];
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

  const ateliers = [
    {
      title: 'Atelier Tissage',
      img: '/images/atelier-1.jpg',
      previewVideo: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
      price: 49
    },
    {
      title: 'Atelier Poterie',
      img: '/images/atelier-2.jpg',
      previewVideo: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      price: 59
    },
    {
      title: 'Création de Bijoux',
      img: '/images/atelier-3.jpg',
      previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      price: 39
    }
  ];

  const openModal = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setShowModal(true);
  };

  const handleUnlock = () => {
    navigate('/paiement'); // Change this to your real payment route
  };

  const testimonials = [
    {
      name: 'Mike Angels',
      role: 'Architecte',
      img: '/images/testi-1.jpg',
      text: 'Grâce à AfricArt, j’ai pu présenter mes créations à un public que je n’aurais jamais atteint autrement. C’est plus qu’un site, c’est une vraie vitrine pour notre culture.'
    },
    {
      name: 'Carl Oswal',
      role: 'Constructeur',
      img: '/images/testi-2.jpg',
      text: 'Avant AfricArt, mes œuvres restaient locales. Aujourd’hui, j’envoie mes produits au Canada, en France, et même au Japon !'
    },
    {
      name: 'Mark Smith',
      role: 'Tisserand',
      img: '/images/testi-3.jpg',
      text: 'AfricArt m’a permis de vendre mes textiles faits main sans intermédiaires. Je contrôle mes prix et je parle directement avec mes clients.'
    },
    {
      name: 'Léa Dubois',
      role: 'Acheteuse française',
      img: '/images/testi-4.jpg',
      text: 'J’ai acheté un panier tissé pour ma mère. Elle a adoré, et moi aussi. L’histoire derrière chaque objet donne une vraie valeur émotionnelle.'
    }
  ];

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Célébrons l’artisanat africain authentique</h1>
          <p className="hero-subtitle">
            Découvrez, soutenez et partagez des créations uniques faites avec passion.
          </p>
          <Button className="hero-button" onClick={() => navigate('/marketplace')}>
            Explorer le Marketplace
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="about-reimagined">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="about-heading">L’Artisanat, l’âme vivante de l’Afrique</h2>
              <p className="about-description">
                Chaque création artisanale raconte une histoire – de savoir-faire, de culture et de passion.
                AfricArt donne une voix aux mains qui tissent, sculptent et façonnent l’âme de l’Afrique.
              </p>
              <ul className="about-values">
                <li><i className="fa-solid fa-globe"></i> Présence mondiale pour les créateurs locaux</li>
                <li><i className="fa-solid fa-people-group"></i> Communauté d’artisans solidaires</li>
                <li><i className="fa-solid fa-leaf"></i> Artisanat éthique & durable</li>
              </ul>
              <Button className="about-cta" onClick={() => navigate('/marketplace')}>
                Découvrir les artisans
              </Button>
            </Col>
            <Col md={6}>
              <div className="about-image-wrapper">
                <div className="pattern-background" />
                <img src={artisanImage} alt="Artisan africain" className="about-main-image" />
                <div className="about-quote">
                  <i className="fa-solid fa-quote-left" />
                  <span>Créer, c’est préserver notre histoire.</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories */}
      <section className="categories">
        <Container>
          <h2>Catégories populaires</h2>
          <Row>
           {categories.map((cat, idx) => (
  <Col md={3} key={idx}>
    <Card className="category-card">
      <Card.Img variant="top" src={cat.img} />
      <Card.Body>
        <Card.Title>{cat.title}</Card.Title>
      </Card.Body>
    </Card>
  </Col>
))}
            
          </Row>
        </Container>
      </section>
             {/* Ateliers Section */}
      <section className="ateliers-preview">
        <Container>
          <h2 className="section-title">Apprendre & Créer</h2>
          <p className="section-subtitle">Participez à des ateliers exclusifs animés par nos artisans</p>
          <Row>
            {ateliers.map((a, idx) => (
              <Col md={4} key={idx}>
                <Card className="atelier-card" onClick={() => openModal(a)}>
                  <Card.Img variant="top" src={a.img} />
                  <Card.Body>
                    <Card.Title>{a.title}</Card.Title>
                    <Card.Text>Animé par un artisan local · 2h · Vidéo exclusive</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Modal for Workshop Preview */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedWorkshop?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="video-wrapper">
            <iframe
              width="100%"
              height="360"
              src={selectedWorkshop?.previewVideo}
              title="Preview"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            />
          </div>
          <p className="mt-3">
            Découvrez une introduction gratuite. Pour débloquer l’atelier complet, procédez au paiement sécurisé.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleUnlock}>
            Débloquer le contenu complet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Featured Products */}
      <section className="featured">
        <Container>
          <h2>Produits en vedette</h2>
          <Row>
            {[1, 2, 3].map((p) => (
              <Col md={4} key={p}>
                <Card className="product-card">
                  <Card.Img variant="top" src={`/images/product-${p}.jpg`} />
                  <Card.Body>
                    <Card.Title>Produit {p}</Card.Title>
                    <Card.Text>Artisan: Nom</Card.Text>
                    <Button variant="dark" size="sm">Voir</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="testimonials-slider">
        <Container>
          <h2 className="testimonials-title">Témoignages</h2>
          <p className="testimonials-subtitle">Ce qu’ils disent de nous</p>
          <div className="underline" />
          <div className="testimonial-swiper-wrapper">
            <div className="swiper-button-prev-custom arrow">
              <ChevronLeft className="arrow-icon" />
            </div>
            <div className="swiper-button-next-custom arrow">
              <ChevronRight className="arrow-icon" />
            </div>
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
                disabledClass: 'swiper-button-disabled',
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="testimonial-card">
                    <p className="testimonial-text">« {t.text} »</p>
                    <img src={t.img} alt={t.name} className="testimonial-img" />
                    <h5 className="testimonial-name">{t.name}</h5>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Container>
      </section>

     

      {/* Newsletter CTA */}
      <section className="newsletter">
        <Container className="text-center">
          <h3>Restez informé</h3>
          <p>Recevez les dernières nouveautés, offres exclusives et actualités d’AfricArt directement dans votre boîte mail.</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Entrez votre adresse email"
              required
            />
            <button type="submit">S'abonner</button>
          </form>
        </Container>
      </section>

    </div>
  );
};

export default Home;
