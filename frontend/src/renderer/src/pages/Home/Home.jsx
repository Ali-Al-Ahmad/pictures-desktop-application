import './Home.css'
import image1 from '../../assets/nature1.jpg'
import image2 from '../../assets/nature2.jpg'
import image3 from '../../assets/nature3.jpg'

const Home = () => {
  const images = [
    { id: 1, src: image1, alt: 'Image 1' },
    { id: 2, src: image2, alt: 'Image 2' },
    { id: 3, src: image3, alt: 'Image 3' }
  ]

  return (
    <div className="gallery">
      {images.map((image) => (
        <div key={image.id} className="image-container">
          <img src={image.src} alt={image.alt} className="image" />
          <div className="button-container">
            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
