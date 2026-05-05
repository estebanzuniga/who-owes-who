import axios, { type InternalAxiosRequestConfig } from 'axios'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
})

// Automatically refresh access token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as RetryConfig
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await api.post('/auth/refresh')
        return api(original)
      } catch {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api