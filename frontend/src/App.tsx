import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop';

import Footer from './components/footer/footer';
import Header from './components/header/Header';
import Register from './components/register/Register';
import LoginSignup from './components/login/LoginSignup'; // adjust the path
import Home from './page/home/home';


function App() {
  return (
    <div className="page-wrapper">
       <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginSignup />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
