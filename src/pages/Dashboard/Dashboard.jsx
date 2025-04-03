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
        <h1>AION AI Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {username || "User"}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>Your Crypto Assistant</h2>
        <p>This is your dashboard. You are now logged in!</p>
      </div>
    </div>
  )
}

export default Dashboard

