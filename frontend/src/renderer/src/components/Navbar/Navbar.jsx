import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../utils/LogoutHook'
import './Navbar.css'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeUser } from '../../redux/slices/userSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [isHover, setIsHover] = useState(false)

  const logoutApp = async () => {
    const logoutReturn = await logout()
    if (logoutReturn) {
      dispatch(removeUser())
      navigate('/')
    }
  }
  return (
    <div className="header">
      <nav>
        <Link to="/home">
          <div className="logo">Picsart</div>
        </Link>
        <div className="nav-items">
          {localStorage.getItem('token') && (
            <Link
              to="/chats"
              className={currentPath === '/chats' && !isHover ? 'nav-link active-tab' : 'nav-link'}
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
            >
              <p>Chats</p>
            </Link>
          )}
          {/* if User Not LoggedIn show signup/login */}
          {!localStorage.getItem('token') && (
            <Link to={currentPath === '/signup' ? '/' : 'signup'} className="nav-link">
              <p>{currentPath === '/signup' ? 'Login' : 'Signup'}</p>
            </Link>
          )}

          {/* if User LoggedIn show Home/Upload */}
          {localStorage.getItem('token') && (
            <Link
              to="/home"
              className={currentPath === '/home' && !isHover ? 'nav-link active-tab' : 'nav-link'}
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
            >
              <p>Home</p>
            </Link>
          )}

          {localStorage.getItem('token') && (
            <Link
              to="/upload"
              className={currentPath === '/upload' && !isHover ? 'nav-link active-tab' : 'nav-link'}
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
            >
              <p>Upload</p>
            </Link>
          )}

          {/*show Logout only if loggedin */}

          {localStorage.getItem('token') && (
            <p
              onClick={logoutApp}
              className="nav-link"
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
            >
              Logout
            </p>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
