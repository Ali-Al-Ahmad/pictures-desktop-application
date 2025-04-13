import { useSelector } from 'react-redux'
import './Home.css'
const Home = () => {
  const user = useSelector((global) => global.user)

  return (
    <div className="home-page">
      <h1>home1</h1>
      <h1>home2</h1>
      <h1>home3</h1>
      <h1>home4</h1>
      <h1>home5</h1>
      <h1>home</h1>
      <h1>home</h1>
      <h1>home</h1>
      <h1>{user?.id}</h1>
      <h1>{user?.full_name}</h1>
      <h1>{user?.email}</h1>
      <h1>{user?.token}</h1>
    </div>
  )
}

export default Home
