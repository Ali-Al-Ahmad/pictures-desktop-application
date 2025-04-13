import { useSelector } from 'react-redux'
import './Upload.css'

const Upload = () => {
  const user = useSelector((global) => global.user)
  return (
    <div>
      <h1>Upload1</h1>
      <h1>Upload2</h1>
      <h1>Upload3</h1>
      <h1>Upload4</h1>
      <h1>Upload5</h1>
      <h1>Upload</h1>
      <h1>Upload</h1>
      <h1>Upload</h1>
      <h1>{user?.id}</h1>
      <h1>{user?.full_name}</h1>
      <h1>{user?.email}</h1>
      <h1>{user?.token}</h1>
    </div>
  )
}

export default Upload
