"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Home from "./pages/Home"
import ContactUs from "./pages/ContactUs/Contact"
import Coins from "./pages/Coins/Coins"
import Predict from "./pages/Predict/Predict"
import GoPro from "./pages/GoPro/GoPro"
import Portfolio from "./pages/Portfolio/Portfolio"
import Signup from "./pages/Signup/Signup"
import Dashboard from "./pages/Dashboard/Dashboard"
import Info from "./pages/Info/Info"
import Services from "./sections/HomeComponents/Services/Services"
import About from "./sections/HomeComponents/AboutUs/AboutUs"
import Header from "./pages/Header/Header"
import Loader from "./sections/HomeComponents/Loader/Loader"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.Auth)

  if (!token) {
    return <Navigate to="/signup" replace />
  }

  return children
}

function App() {
  const [loading, setLoading] = useState(true)
  const { token } = useSelector((state) => state.Auth)

  useEffect(() => {
    document.body.style.overflow = "hidden" // Prevent scrolling while loading

    setTimeout(() => {
      setLoading(false)
      document.body.style.overflow = "auto" // Re-enable scrolling
    }, 2000)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/gopro" element={<GoPro />} />
        <Route path="/portfolio" element={<Portfolio />} />

        {/* Auth routes */}
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/info" element={<Info />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App

