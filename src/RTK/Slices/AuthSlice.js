import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

// Get the API URL from environment variables or use a default
const API_URL = "http://127.0.0.1:8000";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Handle only server errors as errors
  }
})

// Add request interceptor to handle redirects
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 308) {
      // Handle redirect
      const redirectUrl = error.response.headers.location;
      return api.request({
        method: error.config.method,
        url: redirectUrl,
        data: error.config.data
      });
    }
    return Promise.reject(error);
  }
)

const initialState = {
  username: null,
  token: localStorage.getItem("token") || null,
  toastStatus: "",
  loading: false,
  toastMessage: "",
  showToast: false,
  error: null
}

export const Login = createAsyncThunk("AuthSlice/Login", async ({ username, password }, { rejectWithValue }) => {
  try {
    console.log("Login attempt with:", username)
    console.log("API URL:", API_URL)

    const response = await api.post("/auth/login", {
      username,
      password,
    })

    console.log("Login response:", response.data)
    
    // Handle the token format from the backend
    const token = response.data.access_token || response.data.token
    if (!token) {
      throw new Error("No token received from server")
    }

    // Store token in localStorage
    localStorage.setItem("token", token)

    return {
      access_token: token,
      username: username
    }
  } catch (error) {
    console.error("Login error:", error)
    console.error("Full error object:", JSON.stringify(error, null, 2))

    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
      console.error("Error response headers:", error.response.headers)
      return rejectWithValue(error.response.data)
    }

    if (error.request) {
      console.error("Error request:", error.request)
      return rejectWithValue({ detail: "No response received from server. Please check your connection." })
    }

    return rejectWithValue({ detail: error.message || "Login failed. Please try again." })
  }
})

export const Register = createAsyncThunk("AuthSlice/register", async ({ username, password }, { rejectWithValue }) => {
  try {
    console.log("Register attempt with:", username)
    console.log("API URL:", API_URL)

    const userData = {
      username,
      password,
    }

    console.log("Sending registration data:", userData)

    const response = await api.post("/auth/register", userData)

    console.log("Registration response:", response.data)
    
    // If registration includes a token, store it
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token)
    }

    return {
      message: response.data.message || "Registration successful",
      user: response.data.user,
      access_token: response.data.access_token
    }
  } catch (error) {
    console.error("Registration error:", error)
    console.error("Full error object:", JSON.stringify(error, null, 2))

    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
      console.error("Error response headers:", error.response.headers)
      return rejectWithValue(error.response.data)
    }

    if (error.request) {
      console.error("Error request:", error.request)
      return rejectWithValue({ detail: "No response received from server. Please check your connection." })
    }

    return rejectWithValue({ detail: error.message || "Registration failed. Please try again." })
  }
})

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setToastStatus: (state, action) => {
      state.toastStatus = action.payload
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setShowToast: (state, action) => {
      state.showToast = action.payload
    },
    clearToken: (state) => {
      state.token = null
      localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(Login.pending, (state) => {
        state.loading = true
        state.showToast = false
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.token = action.payload.access_token
        localStorage.setItem("token", action.payload.access_token)
        state.username = action.payload.username || action.payload.user?.username
        state.loading = false
        state.toastStatus = "success"
        state.toastMessage = "Login successful!"
        state.showToast = true
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false
        state.toastStatus = "error"
        state.toastMessage = action.payload?.response?.data?.detail || "Login failed. Please check your credentials."
        state.showToast = true
      })
      .addCase(Register.pending, (state) => {
        state.loading = true
        state.showToast = false
      })
      .addCase(Register.fulfilled, (state, action) => {
        state.loading = false
        state.toastStatus = "success"
        state.toastMessage = "Account created successfully! You can now log in."
        state.showToast = true
      })
      .addCase(Register.rejected, (state, action) => {
        state.loading = false
        state.toastStatus = "error"
        // Improved error message handling
        let errorMessage = "Registration failed. Please try again."

        if (action.payload?.response?.data?.detail) {
          errorMessage = action.payload.response.data.detail
        } else if (action.payload?.message) {
          errorMessage = action.payload.message
        } else if (typeof action.payload === "string") {
          errorMessage = action.payload
        }

        state.toastMessage = errorMessage
        state.showToast = true
      }),
})

export const { setToken, setToastStatus, setToastMessage, setLoading, setShowToast, clearToken } = AuthSlice.actions
export default AuthSlice.reducer

