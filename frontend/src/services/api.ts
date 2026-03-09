import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for cross-origin requests
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors and logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.response?.data)
    if (error.response?.status === 401) {
      // Handle unauthorized access - cookies will be cleared by backend
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
