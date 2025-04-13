import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProtectedRoutes = () => {
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  const validateToken = async (token) => {
    if (!token) {
      setLoading(false)
      setIsAuth(false)
      localStorage.clear()
    } else {
      setLoading(false)
      setIsAuth(true)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      setIsAuth(false)
      toast.error('You Are Not Logged In')

      localStorage.clear()
    } else {
      validateToken(token)
    }
  }, [])

  return loading ? <p>Loading</p> : isAuth ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes
