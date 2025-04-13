import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import './Signup.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: 'user',
    email: 'user@gmail.com',
    password: 'useruser'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.email === '' || formData.password === '' || formData.full_name === '') {
        toast.error(`All fields required`)
        return
      }

      const response = await axiosInstance.post('/auth/signup', formData)
      console.log('response: ', response)

      localStorage.setItem('token', response.data.data.token)
      toast.success(response.data.message)

      navigate('/home')
    } catch (err) {
      toast.error(err.response?.data?.message)
    }
  }

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Signup</button>
        <p className="form-text">
          You have an account?{' '}
          <Link to="/">
            <span className="login-signup-text">Login</span>
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup
