import { useEffect, useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../../utils/cropImage'
import './Home.css'

const { ipcRenderer } = window.electron

const Home = () => {
  const [images, setImages] = useState([])
  const [selectedImagePath, setSelectedImagePath] = useState(null)
  const [previewBase64, setPreviewBase64] = useState(null)
  const [bufferBase64, setBufferBase64] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isGrayscale, setIsGrayscale] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    const fetchImages = () => {
      setLoading(true)
      ipcRenderer.send('get-images')
    }

    ipcRenderer.on('get-images-response', (event, { success, images }) => {
      if (success) setImages(images)
      setLoading(false)
    })

    fetchImages()

    return () => {
      ipcRenderer.removeAllListeners('get-images-response')
    }
  }, [])

  const openEditModal = useCallback((imagePath) => {
    setSelectedImagePath(imagePath)
    ipcRenderer.send('edit-image', { imagePath, action: '' })

    const handleEditResponse = (event, { success, base64, buffer }) => {
      if (success) {
        setPreviewBase64(base64)
        setBufferBase64(buffer)
      }
    }

    ipcRenderer.on('edit-image-response', handleEditResponse)

    return () => {
      ipcRenderer.removeListener('edit-image-response', handleEditResponse)
    }
  }, [])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropDone = async () => {
    try {
      const croppedImage = await getCroppedImg(previewBase64, croppedAreaPixels)
      const croppedBase64 = croppedImage.split(',')[1]

      ipcRenderer.send('edit-image', {
        bufferBase64: croppedBase64,
        action: 'crop',
        options: {
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height
        }
      })

      setIsCropping(false)
    } catch (e) {
      console.error('Crop failed', e)
    }
  }

  const applyEdit = useCallback(
    (action) => {
      if (!bufferBase64) return

      if (action === 'greyscale') {
        setIsGrayscale((prev) => !prev)
      }

      ipcRenderer.send('edit-image', {
        bufferBase64: previewBase64.replace(/^data:image\/\w+;base64,/, ''),
        action
      })

      const handleEditResponse = (event, { success, base64, buffer, err }) => {
        if (success) {
          setPreviewBase64(base64)
          setBufferBase64(buffer)
        } else {
          console.error('Error:', err)
        }
      }

      ipcRenderer.on('edit-image-response', handleEditResponse)

      return () => {
        ipcRenderer.removeListener('edit-image-response', handleEditResponse)
      }
    },
    [bufferBase64, previewBase64, isGrayscale]
  )

  const resetImage = () => {
    const imageName = selectedImagePath.split('/').pop()
    ipcRenderer.send('reset-image', { imageName })
  }

  useEffect(() => {
    const handleResetResponse = (event, { success, base64, buffer }) => {
      if (success) {
        setPreviewBase64(base64)
        setBufferBase64(buffer)
        setIsGrayscale(false)
      } else {
        console.error('Failed to reset image')
      }
    }

    ipcRenderer.on('reset-image-response', handleResetResponse)

    return () => {
      ipcRenderer.removeListener('reset-image-response', handleResetResponse)
    }
  }, [])

  const saveEditedImage = () => {
    const imageName = selectedImagePath.split('/').pop()
    ipcRenderer.send('save-edited-image', { imageName, bufferBase64 })
    closeModal()
  }

  const closeModal = () => {
    setSelectedImagePath(null)
    setPreviewBase64(null)
    setBufferBase64(null)
    setIsGrayscale(false)
    setIsCropping(false)
  }

  const handleDeleteImage = (imagePath) => {
    const confirmed = confirm('Are you sure you want to delete this image?')
    if (confirmed) {
      const imageName = imagePath.split('/').pop()
      ipcRenderer.send('delete-image', imageName)
      ipcRenderer.once('delete-image-response', (event, { success }) => {
        if (success) {
          setImages((prev) => prev.filter((img) => img !== imagePath))
        }
      })
    }
  }

  return (
    <div className="gallery">
      {loading ? (
        <p>Loading images...</p>
      ) : (
        images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={`${image}?t=${Date.now()}`} alt={`img-${index}`} className="image" />
            <div className="button-container-home">
              <button className="btn" onClick={() => openEditModal(image)}>
                Edit
              </button>
              <button className="btn" onClick={() => handleDeleteImage(image)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {selectedImagePath && (
        <div className="modal">
          <div className="modal-content">
            <img src={previewBase64} alt="Preview" className="modal-image" />
            <div className="modal-buttons">
              <button className="btn" onClick={() => applyEdit('rotate')}>
                Rotate
              </button>
              <button className="btn" onClick={() => applyEdit('greyscale')}>
                Grayscale
              </button>
              <button className="btn" onClick={() => setIsCropping(true)}>
                Crop
              </button>
              <button className="btn" onClick={() => applyEdit('watermark')}>
                Watermark
              </button>
              <button className="btn" onClick={resetImage}>
                Reset
              </button>
            </div>
            {isCropping && (
              <>
                <div className="crop-container">
                  <Cropper
                    image={previewBase64}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="crop-controls">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                  />
                  <button className="btn" onClick={handleCropDone}>
                    Apply Crop
                  </button>
                  <button className="btn" onClick={() => setIsCropping(false)}>
                    Cancel Crop
                  </button>
                </div>
              </>
            )}
            <div className="modal-footer">
              <button className="save-button btn" onClick={saveEditedImage}>
                Save
              </button>
              <button className="cancel-button btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
