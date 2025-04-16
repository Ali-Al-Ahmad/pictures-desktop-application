import { Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Navbar from './components/Navbar/Navbar'
import Upload from './pages/Upload/Upload'
import Chats from './pages/Chats/Chats'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chats" element={<Chats />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
