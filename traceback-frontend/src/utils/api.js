import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  console.log('REQUEST:', config.method?.toUpperCase(), config.baseURL + config.url)
  return config
}, Promise.reject)

api.interceptors.response.use(
  r => {
    console.log('RESPONSE:', r.config.url, r.status, r.data)
    return r
  },
  err => {
    console.error('ERROR:', err.config?.url, err.response?.status, err.response?.data)
    if (err.response?.status === 401) {
      localStorage.removeItem('tb_token')
      localStorage.removeItem('tb_user')
      window.dispatchEvent(new Event('tb:logout'))
    }
    return Promise.reject(err)
  }
)

export default api