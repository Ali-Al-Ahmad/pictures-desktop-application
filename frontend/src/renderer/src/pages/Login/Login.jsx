import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: 'user@gmail.com',
    password: 'useruser'
  })

  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.email === '' || formData.password === '') {
        toast.error(`All fields required`)
        return
      }

      const response = await axiosInstance.post('/auth/login', formData)

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token)
        toast.success(response.data.message)

        navigate('/home')
      }
    } catch (err) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">login</button>
        <p>
          Dont have an account?{' '}
          <Link to="/signup">
            <span className="login-signup-text">Register</span>
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
