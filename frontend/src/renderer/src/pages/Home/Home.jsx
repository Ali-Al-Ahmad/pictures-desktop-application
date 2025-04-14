import { useEffect, useState } from 'react'
import './Home.css'

const { ipcRenderer } = window.electron

const Home = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    ipcRenderer.send('get-images')

    ipcRenderer.on('get-images-response', (event, { success, images }) => {
      if (success) {
        setImages(images)
      } else {
        console.error('Error fetching images:', images)
      }
    })
    return () => {
      ipcRenderer.removeAllListeners('get-images-response')
    }
  }, [])

  const handleDeleteImage = (imagePath) => {
    const confirmed = confirm('Are you sure you want to delete image?')
    if (confirmed) {
      const imageName = imagePath.split('/').pop()
      ipcRenderer.send('delete-image', imageName)

      ipcRenderer.once('delete-image-response', (event, { success }) => {
        if (success) {
          setImages((prevImages) => prevImages.filter((img) => img !== imagePath))
        } else {
          console.error('Error deleting image')
        }
      })
    }
  }

  return (
    <div className="gallery">
      {images?.length > 0 &&
        images?.map((image, index) => (
          <div key={index} className="image-container">
            <img src={image} alt={image} className="image" />
            <div className="button-container-home">
              <button className="edit-button">Edit</button>
              <button className="delete-button" onClick={() => handleDeleteImage(image)}>
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Home
