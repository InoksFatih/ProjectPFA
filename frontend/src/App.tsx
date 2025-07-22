import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';

import Footer from './components/footer/footer';
import Header from './components/header/Header';
import Register from './components/register/Register';
import LoginSignup from './components/login/LoginSignup'; 
import Home from './page/home/home';
import Marketplace from './page/marketplace/marketplace';
import ProductDetails from './page/productDetails/ProductDetails';
import Panier from './page/panier/Panier';
import Contact from './page/contact'; // 👈 import du fichier contact.tsx

function App() {
  return (
    <div className="page-wrapper">
       <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/produit/:id" element={<ProductDetails />} />
           <Route path="/contact" element={<Contact />} />


          {/* Add other routes as needed */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
