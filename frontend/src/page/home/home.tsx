import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">Célébrons l’artisanat africain authentique</h1>
              <p className="hero-subtitle">
                Découvrez, soutenez et partagez des créations uniques faites avec passion.
              </p>
              <Button className="hero-button" onClick={() => navigate('/marketplace')}>
                Explorer le Marketplace
              </Button>
            </Col>
            <Col md={6}>
              <div className="hero-image" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* About */}
      <section className="about">
  <Container>
    <Row className="align-items-center">
      <Col md={6}>
        <h2 className="about-title">Notre mission</h2>
        <p className="about-text">
          AfricArt met en lumière les artisans d'Afrique, en leur donnant une plateforme pour vendre, se faire connaître
          et connecter avec un public mondial.
        </p>
      </Col>
      <Col md={6}>
        <img src="/images/about-artisan.jpg" alt="Artisan" className="about-img" />
      </Col>
    </Row>
  </Container>
</section>


      {/* Categories */}
      <section className="categories">
        <Container>
          <h2>Catégories populaires</h2>
          <Row>
            {['Bijoux', 'Textiles', 'Décoration', 'Cuir'].map((cat, idx) => (
              <Col md={3} key={idx}>
                <Card className="category-card">
                  <Card.Img variant="top" src={`/images/cat-${idx + 1}.jpg`} />
                  <Card.Body>
                    <Card.Title>{cat}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

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
      <section className="testimonials">
        <Container>
          <h2>Témoignages</h2>
          <Row>
            {[1, 2].map((id) => (
              <Col md={6} key={id}>
                <div className="testimonial">
                  <p>“Une plateforme magnifique pour faire découvrir mon travail !”</p>
                  <span>– Artisan X</span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="cta">
        <Container className="text-center">
          <h3>Vous êtes artisan ?</h3>
          <p>Exposez votre talent et touchez une clientèle internationale.</p>
          <Button variant="light" onClick={() => navigate('/register')}>
            Rejoignez AfricArt
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;
