// src/components/Footer.tsx
import "./Footer.css";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
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
             
            </div>

            {/* Contact */}
            <div className="col-md-4 offset-md-1 footer-contact">
              <h5>Contact</h5>
              <p><FaMapMarkerAlt /> Maroc, Rabat</p>
              <p><FaPhone /> +212 5 28-284156</p>
              <p><FaEnvelope /> <a href="mailto:contact@africart.com">Africart12@outlook.com</a></p>
            </div>

            {/* Links */}
            <div className="col-md-4 footer-links">
              <div className="row">
                <div className="col">
                  <h5>Liens utiles</h5>
                  <p><a href="#">Accueil</a></p>
                  <p><a href="#">Marketplace</a></p>
                  <p><a href="#">Ateliers</a></p>
                  <p><a href="#">Contact</a></p>
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
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
