import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import FilterSidebar from '../../components/marketplace/FilterSidezbar';
import './Marketplace.css';
import { Link } from 'react-router-dom';

interface ProductImage {
  image_url: string;
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

const ALL_ARTISANAT_TYPES = [
  'Poterie', 'Tapis', 'Bijoux', 'Textile', 'Sculpture sur bois', 'Peinture', 'Cuivre',
  'Vannerie', 'Cuir', 'Art en métal', 'Teinture', 'Calligraphie', 'Tissage', 'Verre soufflé',
];

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 12;

  const [filters, setFilters] = useState({
    types: [] as string[],
    countries: [] as string[],
    priceMin: 20,
    priceMax: 2000,
    onlyInStock: false,
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/artisan/produits/marketplace')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Erreur de chargement:', err));
  }, []);

  const getUnique = (key: keyof Product): string[] =>
    [...new Set(products.map((p) => String(p[key])))] as string[];

  const handleFilterToggle = (key: 'types' | 'countries', value: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filtered = products.filter((p) => {
    const matchType = filters.types.length === 0 || filters.types.includes(p.type_artisanat);
    const matchCountry = filters.countries.length === 0 || filters.countries.includes(p.artisan_pays);
    const matchPrice = p.prix >= filters.priceMin && p.prix <= filters.priceMax;
    const matchStock = !filters.onlyInStock || p.stock > 0;
    const matchSearch =
      p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchType && matchCountry && matchPrice && matchStock && matchSearch;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <Container fluid className="marketplace-container">
      <Row>
        {/* Sidebar */}
        <Col md={3}>
          <FilterSidebar
            filters={filters}
            onToggle={handleFilterToggle}
            onChange={handleFilterChange}
            types={ALL_ARTISANAT_TYPES}
            availableTypes={new Set(products.map((p) => p.type_artisanat))}
            countries={getUnique('artisan_pays')}
            minPrice={50}
            maxPrice={2000}
          />
        </Col>

        {/* Product Grid */}
        <Col xs={12} md={9} className="ps-md-4">
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Row className="g-4">
            {paginated.map((product) => (
              <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Link to={`/produit/${product.id}`} className="product-link">
                  <Card className="product-card">
                    <Card.Img
                      variant="top"
                      src={
                        product.images[0]?.image_url
                          ? `http://localhost:5000${product.images[0].image_url}`
                          : '/default.jpg'
                      }
                      alt={product.titre}
                      className="product-image"
                    />
                    <Card.Body>
                      <Card.Title>{product.titre}</Card.Title>
                      <Card.Text>{product.prix} MAD</Card.Text>
                      <Card.Text>
                        <small>{product.artisan_nom} ({product.artisan_pays})</small>
                      </Card.Text>
                      <Card.Text>
                        <small>{product.type_artisanat}</small>
                      </Card.Text>
                      <Button className="voir-plus-btn">Voir plus</Button>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
            {paginated.length === 0 && (
              <p className="text-muted">Aucun produit trouvé.</p>
            )}
          </Row>

          {/* Pagination */}
          <div className="pagination-controls text-center mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'dark' : 'outline-dark'}
                className="me-2"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Marketplace;
