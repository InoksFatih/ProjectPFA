import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { Contact, House, ShoppingBag, UserCircle, ShoppingCart, Search } from 'lucide-react';
import defaultProfileImg from '../../assets/img/profile.png';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCart(); // ✅ Use context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setProfileImage(user.profilePhoto || defaultProfileImg);
        setFirstName(user.firstName || '');

        if (user.role?.toLowerCase() === 'client') {
          refreshCartCount(); // ✅ context handles count
        }
      } catch (err) {
        console.error('🔴 User parsing failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setIsMobileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fonction de recherche simulée - à remplacer par votre API
  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Remplacez cette partie par votre appel API réel
      // const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      // const results = await response.json();
      
      // Simulation de résultats de recherche
      const mockResults = [
        { id: 1, type: 'product', name: 'Sculpture en bois', artist: 'Ahmed Benali', image: '/images/sculpture1.jpg' },
        { id: 2, type: 'product', name: 'Poterie berbère', artist: 'Fatima Zahra', image: '/images/pottery1.jpg' },
        { id: 3, type: 'artist', name: 'Mohammed Artisan', speciality: 'Maroquinerie', image: '/images/artist1.jpg' },
        { id: 4, type: 'product', name: 'Tapis traditionnel', artist: 'Aicha Tazi', image: '/images/carpet1.jpg' },
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(query.toLowerCase())) ||
        (item.speciality && item.speciality.toLowerCase().includes(query.toLowerCase()))
      );

      setSearchResults(mockResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleResultClick = (result: any) => {
    if (result.type === 'product') {
      navigate(`/product/${result.id}`);
    } else if (result.type === 'artist') {
      navigate(`/artist/${result.id}`);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  const handleProfileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  return (
    <header className="africart-header">
      <div className="header-inner">
        <div className="brand" onClick={() => navigate('/')}>AfricArt</div>

        {/* Barre de recherche */}
        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher produits, artisans..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              />
            </div>
          </form>

          {/* Résultats de recherche */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result: any) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-image">
                    <img src={result.image || defaultProfileImg} alt={result.name} />
                  </div>
                  <div className="result-content">
                    <div className="result-name">{result.name}</div>
                    <div className="result-meta">
                      {result.type === 'product' ? (
                        <span className="result-artist">Par {result.artist}</span>
                      ) : (
                        <span className="result-speciality">{result.speciality}</span>
                      )}
                    </div>
                    <span className={`result-type ${result.type}`}>
                      {result.type === 'product' ? 'Produit' : 'Artisan'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="search-footer">
                <button onClick={handleSearchSubmit} className="view-all-results">
                  Voir tous les résultats pour "{searchQuery}"
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="nav-links d-none d-md-flex">
          <div className="nav-item" onClick={() => navigate('/')}>
            <House className="icon" />
            <span>Accueil</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/marketplace')}>
            <ShoppingBag className="icon" />
            <span>Marketplace</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/ateliers')}>
            <UserCircle className="icon" />
            <span>Ateliers</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/contact')}>
            <Contact className="icon" />
            <span>Contact</span>
          </div>
        </nav>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger d-md-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>

        {/* Auth Section (Desktop) */}
        <div className="auth-wrapper d-none d-md-flex">
          {isLoggedIn && (
            <div
              className="cart-icon"
              onClick={() => navigate('/panier')}
              style={{ position: 'relative', marginRight: '1rem', cursor: 'pointer' }}
            >
              <ShoppingCart className="icon" />
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
            </div>
          )}

          {!isLoggedIn ? (
            <>
              <span className="signin" onClick={() => navigate('/login')}>Sign in</span>
              <button className="signup" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          ) : (
            <div className="profile-menu" ref={menuRef}>
              <div className="profile-info" onClick={handleProfileClick}>
                <img src={profileImage} alt="Profile" className="profile-image" />
                <span className="profile-name">{firstName}</span>
              </div>
              {showMenu && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <div onClick={() => navigate('/profile')}>Mon Profil</div>
                  <div onClick={() => navigate('/dashboard')}>Dashboard</div>
                  <div onClick={handleLogout}>Se déconnecter</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu d-md-none" ref={menuRef}>
          {/* Barre de recherche mobile */}
          <div className="mobile-search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          <div className="mobile-nav-item" onClick={() => navigate('/')}>Accueil</div>
          <div className="mobile-nav-item" onClick={() => navigate('/marketplace')}>Marketplace</div>
          <div className="mobile-nav-item" onClick={() => navigate('/ateliers')}>Ateliers</div>
          <div className="mobile-nav-item" onClick={() => navigate('/contact')}>Contact</div>

          {!isLoggedIn ? (
            <>
              <div className="mobile-nav-item" onClick={() => navigate('/login')}>Sign In</div>
              <div className="mobile-nav-item" onClick={() => navigate('/register')}>Sign Up</div>
            </>
          ) : (
            <>
              <div className="mobile-nav-item" onClick={() => navigate('/profile')}>Mon Profil</div>
              <div className="mobile-nav-item" onClick={() => navigate('/dashboard')}>Dashboard</div>
              <div className="mobile-nav-item" onClick={handleLogout}>Se déconnecter</div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;