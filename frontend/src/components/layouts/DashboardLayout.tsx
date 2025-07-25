import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: '🏠 Tableau de bord', path: '/dashboard' },
    { label: '🛍️ Mes Produits', path: '/dashboard/produits' },
    { label: '📦 Commandes', path: '/dashboard/commandes' },
    { label: '👤 Profil', path: '/dashboard/profil' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar">
        <div className="logo" onClick={() => navigate('/')}>AfricArt</div>
        <ul className="menu">
          {menuItems.map((item, i) => (
            <li
              key={i}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <button className="logout" onClick={handleLogout}>↩ Déconnexion</button>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
