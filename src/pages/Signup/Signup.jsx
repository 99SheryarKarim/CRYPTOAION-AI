"use client"

import { useState, useEffect } from "react"
import "./Signup.css"
import { useDispatch, useSelector } from "react-redux"
import { Register, Login, setToastMessage, setToastStatus, setShowToast } from "../../RTK/Slices/AuthSlice"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, showToast, toastMessage, toastStatus, loading: authLoading } = useSelector((state) => state.Auth || {})

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && token) {
      navigate("/dashboard")
    }
  }, [token, navigate, mounted])

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!formData.username || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!isLogin && formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        // Handle login
        const loginResult = await dispatch(
          Login({
            username: formData.username,
            password: formData.password,
          })
        ).unwrap()

        console.log("Login success:", loginResult)
        dispatch(setToastMessage("Login successful!"))
        dispatch(setToastStatus("success"))
        dispatch(setShowToast(true))
        navigate("/dashboard")
      } else {
        // Handle registration
        const registrationResult = await dispatch(
          Register({
            username: formData.username,
            password: formData.password,
          })
        ).unwrap()

        console.log("Registration success:", registrationResult)
        
        // Show success toast and switch to login
        dispatch(setToastMessage("Account created successfully! Please log in."))
        dispatch(setToastStatus("success"))
        dispatch(setShowToast(true))
        
        // Clear form and switch to login after delay
        setTimeout(() => {
          setIsLogin(true)
          setFormData({
            username: "",
            password: "",
            confirmPassword: ""
          })
          dispatch(setShowToast(false))
        }, 3000)
      }
    } catch (error) {
      console.error(isLogin ? "Login error:" : "Registration error:", error)
      let errorMessage = "An error occurred. Please try again."
      
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.message) {
        errorMessage = error.message
      } else if (!navigator.onLine) {
        errorMessage = "Please check your internet connection."
      }
      
      setError(errorMessage)
      dispatch(setToastMessage(errorMessage))
      dispatch(setToastStatus("error"))
      dispatch(setShowToast(true))
      
      setTimeout(() => {
        dispatch(setShowToast(false))
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setFormData({
      username: "",
      password: "",
      confirmPassword: ""
    })
  }

  return (
    <div className="auth-container">
        {showToast && (
          <div className={`toast-notification ${toastStatus}`}>
            {toastMessage}
          </div>
        )}

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo">
                <div className="logo-circle"></div>
                <div className="logo-line"></div>
                <div className="logo-dot dot-1"></div>
                <div className="logo-dot dot-2"></div>
                <div className="logo-dot dot-3"></div>
              </div>
            </div>
            <h1>AION AI</h1>
            <p className="tagline">Your Intelligent Crypto Assistant</p>
          </div>

          <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? "Please wait..." : (isLogin ? "Login" : "Create Account")}
            </button>

            <p className="auth-switch">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={toggleAuthMode} className="switch-button">
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </div>

        <div className="auth-background">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>
        </div>
    </div>
  );
};

export default Signup;
