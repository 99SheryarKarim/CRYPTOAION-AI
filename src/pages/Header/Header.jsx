"use client"

import { Link, useNavigate } from "react-router-dom"
import "../Header/Header.css"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearToken } from "../../RTK/Slices/AuthSlice"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get authentication state from Redux
  const { token, username } = useSelector((state) => state.Auth)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleContactClick = () => {
    closeMenu()
    navigate("/contact")
  }

  const handleLogout = () => {
    dispatch(clearToken())
    closeMenu()
    navigate("/")
  }

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" onClick={closeMenu} style={{ display: "flex", color: "white", textDecoration: "none" }}>
            <img src="/logoooo.png" alt="TNC CRYPTO" />
            <h2 style={{ marginTop: "8px" }}>AION AI</h2>
          </Link>
        </div>

        <div className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={closeMenu}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/coins" onClick={closeMenu}>
                Market
              </Link>
            </li>
            <li>
              <Link to="/predict" onClick={closeMenu}>
                Predict
              </Link>
            </li>
            <li>
              <Link to="/portfolio" onClick={closeMenu}>
                Portfolio
              </Link>
            </li>
            <li className="no-wrap">
              <Link to="/gopro" onClick={closeMenu}>
                Go Premium
              </Link>
            </li>
            <li>
              <Link to="/info" onClick={closeMenu}>
                Info
              </Link>
            </li>

            {/* Conditional rendering based on authentication status */}
            {token ? (
              <>
                <li className="dashboard-link">
                  <Link to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
                <li className="user-info">
                  <span className="username">{username || "User"}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/signup" onClick={closeMenu}>
                  Signup
                </Link>
              </li>
            )}
          </ul>

          <button className="contact-btn" onClick={handleContactClick}>
            Contact Us
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header

