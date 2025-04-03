"use client"

import { useSelector, useDispatch } from "react-redux"
import { clearToken } from "../../RTK/Slices/AuthSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import "./Dashboard.css"

const Dashboard = () => {
  const { username, token } = useSelector((state) => state.Auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to signup if not authenticated
    if (!token) {
      navigate("/signup")
    }
  }, [token, navigate])

  const handleLogout = () => {
    dispatch(clearToken())
    navigate("/signup")
  }

  if (!token) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>AION AI</h1>
        <div className="user-info">
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>Your AI-Powered Crypto Assistant</h2>
        <p>Welcome to your personal crypto trading dashboard. AION AI is here to help you make smarter trading decisions with advanced AI-driven insights and real-time market analysis.</p>
        
        {/* Add more dashboard sections here as needed */}
      </div>
    </div>
  )
}

export default Dashboard

