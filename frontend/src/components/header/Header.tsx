import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { Contact, House, ShoppingBag, UserCircle } from 'lucide-react';
import defaultProfileImg from '../../assets/img/profile.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
    const [firstName, setFirstName] = useState('');

  useEffect(() => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    const user = JSON.parse(userStr);
    setIsLoggedIn(true);
    setProfileImage(user.profilePhoto || defaultProfileImg);
    setFirstName(user.firstName || '');
  } else {
    setIsLoggedIn(false);
  }
}, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
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

  const handleProfileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  return (
    <header className="africart-header">
      <div className="header-inner">
        <div className="brand" onClick={() => navigate('/')}>AfricArt</div>

        <nav className="nav-links">
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

        <div className="auth-wrapper">
          {!isLoggedIn ? (
            <>
              <span className="signin" onClick={() => navigate('/login')}>Sign in</span>
              <button className="signup" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          ) : (
           <div className="profile-menu" ref={menuRef}>
  <div className="profile-info" onClick={handleProfileClick}>
    <img
      src={profileImage}
      alt="Profile"
      className="profile-image"
    />
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
    </header>
  );
};

export default Header;
