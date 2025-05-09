import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v0.1',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
