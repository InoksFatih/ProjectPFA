// src/components/Footer.tsx
import "./Footer.css";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSkype,
  FaFacebookF,
  FaTwitter,
  FaGooglePlusG,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">

            {/* About */}
            <div className="col-md-3 footer-about">
              <h2 className="footer-logo">AfricArt</h2>
              <p>
                Nous sommes une communauté qui célèbre l’artisanat africain authentique. Découvrez, soutenez et partagez des créations uniques.
              </p>
              <p><a href="#">Notre équipe</a></p>
            </div>

            {/* Contact */}
            <div className="col-md-4 offset-md-1 footer-contact">
              <h5>Contact</h5>
              <p><FaMapMarkerAlt /> Maroc, Casablanca</p>
              <p><FaPhone /> +212 5 28 28 41 56</p>
              <p><FaEnvelope /> <a href="mailto:contact@africart.com">contact@africart.com</a></p>
              <p><FaSkype /> you_online</p>
            </div>

            {/* Links */}
            <div className="col-md-4 footer-links">
              <div className="row">
                <div className="col">
                  <h5>Liens utiles</h5>
                  <p><a href="#">Accueil</a></p>
                  <p><a href="#">À propos</a></p>
                  <p><a href="#">Contact</a></p>
                  <p><a href="#">Marketplace</a></p>
                </div>
                <div className="col">
                  <h5>Légal</h5>
                  <p><a href="#">Conditions</a></p>
                  <p><a href="#">Confidentialité</a></p>
                  <p><a href="#">Aide & FAQ</a></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">
          <p>&copy; 2025 AfricArt. Tous droits réservés.</p>
          <div className="socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaGooglePlusG /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaPinterest /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
