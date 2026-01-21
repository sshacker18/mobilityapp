import axios from 'axios'
import { getToken, removeToken } from './auth'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({ baseURL: `${baseURL}/api` })

api.interceptors.request.use((cfg) => {
  const t = getToken()
  if (t && cfg.headers) cfg.headers['Authorization'] = `Bearer ${t}`
  return cfg
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
