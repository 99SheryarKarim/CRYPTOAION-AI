import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Set to true if your API uses cookies for authentication
})

const initialState = {
  username: null,
  token: localStorage.getItem("token") || null,
  toastStatus: "",
  loading: false,
  toastMessage: "",
  showToast: false,
}

export const Login = createAsyncThunk("AuthSlice/Login", async ({ username, password }, { rejectWithValue }) => {
  try {
    console.log("Login attempt with:", username)

    const response = await api.post("/auth/login", {
      username,
      password,
    })

    console.log("Login response:", response.data)
    return response.data
  } catch (error) {
    console.error("Login error:", error.response || error)
    return rejectWithValue(error)
  }
})

export const Register = createAsyncThunk("AuthSlice/register", async ({ email, password }, { rejectWithValue }) => {
  try {
    console.log("Register attempt with:", email)

    // Make sure we're using the correct field names according to the backend API
    const userData = {
      username: email,
      password: password,
    }

    console.log("Sending registration data:", userData)

    const response = await api.post("/auth/register", userData)

    console.log("Registration response:", response.data)
    return response.data
  } catch (error) {
    // Log the full error for debugging
    console.error("Registration error:", error)

    // Log the response data if available
    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
      console.error("Error response headers:", error.response.headers)
    }

    return rejectWithValue(error)
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

