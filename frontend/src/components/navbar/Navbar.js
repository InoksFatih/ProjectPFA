import React, { useState } from "react";
import "./NavbarStyle.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import ProfileInfo from "./ProfileInfo";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOGIN, selectUser } from "../../redux/features/auth/authSlice";
import { logoutUser } from "../../redux/features/auth/authService";
import { ShowOnLogin, ShowOnLogout } from "../protect/hiddenItems";

const Navbar = () => {
  const {user} = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const name = useSelector(selectName);

  const logout = async () => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };


  return (
    <nav className="NavbarItems">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="menu-icone" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      <ul className={clicked ? "Nav-menu active" : "Nav-menu"}>
        <li>
          <Link className="nav-links" to="/">
          <i className="fa-solid fa-house"></i>Home</Link>
        </li>

        <li>
          <Link className="nav-links" to="/about">
          <i className="fa-solid fa-circle-info"></i>About</Link>
        </li>

        <li>
          <Link className="nav-links" to="/tours">
          <i className="fa-brands fa-servicestack"></i>Tours</Link>
        </li>

        <li>
          <Link className="nav-links" to="/contact">
          <i className="fa-solid fa-address-book"></i>Contact</Link>
        </li>
        <ShowOnLogout>
        <li>
          <Link className="nav-links" to="/login">
          <i className="fa-solid fa-right-to-bracket"></i>Sign In</Link>
        </li>
        </ShowOnLogout>
        <ShowOnLogout>
        <li>
          <Link className="nav-links-mobile" to="/register">
          <i className="fa-solid fa-house"></i>Sign Up</Link>
        </li>
        </ShowOnLogout>
        <ShowOnLogout>
        <li>
          <button className="botun">
            <Link to="/register">Sign Up</Link>
          </button>
        </li>
        </ShowOnLogout>
        {/* <ShowOnLogin>
        <li>
            <button onClick={logout} className="nav-links">
              Logout
            </button>
          </li>
        </ShowOnLogin> */}
        <ShowOnLogin>
          <li>
            <ProfileInfo user={user}/>
          </li>
          </ShowOnLogin>
      </ul>
    </nav>
  );
};

export default Navbar;
