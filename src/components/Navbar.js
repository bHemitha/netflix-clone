import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // Sync search bar with URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || "";
    setSearchTerm(query);
  }, [location.search]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out!");
        window.location.href = "/login";
      })
      .catch((err) => alert(err.message));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar__left">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            className="navbar__logo"
          />
        </Link>
      </div>

      <div className="navbar__hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <div className={`navbar__menu ${menuOpen ? "open" : ""}`}>
        <Link to="/watchlist" className="navbar__link" onClick={toggleMenu}>
          📄 My Watchlist
        </Link>

        {/* ✅ Live Search Input */}
        <input
          type="text"
          placeholder="Search movies..."
          className="navbar__search"
          value={searchTerm}
          onChange={(e) => {
            const query = e.target.value;
            setSearchTerm(query);
            if (query.trim()) {
              window.history.replaceState(null, "", `/search?q=${encodeURIComponent(query)}`);
            }
          }}
        />

        {user ? (
          <>
            <span className="navbar__user">{user.email}</span>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Profile"
              className="navbar__avatar"
            />
          </>
        ) : (
          <Link to="/login" className="navbar__link" onClick={toggleMenu}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
