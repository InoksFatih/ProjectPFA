import "./footerStyle.css";
import logo from "../../assets/logo2.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div>
          <div className="logo">
            <img src={logo} />
          </div>
          <p>Discover Your Ideal Destination !</p>
        </div>
        <div>
          <a href="/">
            <i className="fa-brands fa-instagram-square"></i>
          </a>
          <a href="/">
            <i className="fa-brands fa-facebook-square"></i>
          </a>
          <a href="/">
            <i className="fa-brands fa-twitter-square"></i>
          </a>
          <a href="/">
            <i className="fa-brands fa-youtube-square"></i>
          </a>
        </div>
      </div>

      <div className="bottom">
        <div>
          <h4>About</h4>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
        <div>
          <h4>Discover</h4>
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>
        </div>
        <div>
          <h4>Tours</h4>
          <a href="/tour-details/64aec0ca36842f69d9481c49">Popular Destination</a>
          <a href="/tours">Recent tours</a>
          <a href="/tours">All tours</a>
        </div>
        <div>
          <h4>Call center</h4>
          <a >05 28 28 41 56</a>
          <a >+212 5 28 28 45 65</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
