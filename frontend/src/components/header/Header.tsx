import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import { useNavigate , useLocation } from 'react-router-dom';
import { Contact, House, ShoppingBag, UserCircle, ShoppingCart } from 'lucide-react';
import defaultProfileImg from '../../assets/img/profile.png';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/Logo.png';


const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCart(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };
const handleHomeClick = () => {
  if (location.pathname === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    navigate('/');
  }
};
  const handleProfileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  return (
    <header className="africart-header">
      <div className="header-inner">
       <div className="brand" onClick={handleHomeClick}>
  <img src={logo} alt="AfricArt Logo" className="brand-logo" />
  <span className="brand-text">AfricArt</span>
</div>
        {/* Desktop Nav */}
        <nav className="nav-links d-none d-md-flex">
          <div className="nav-item" onClick={handleHomeClick}>
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
