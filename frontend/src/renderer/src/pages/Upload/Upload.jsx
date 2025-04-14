import './Upload.css'
import uploadIcon from '../../assets/uploadIcon.svg'
import { useRef, useState } from 'react'

const { ipcRenderer } = window.electron

const Upload = () => {
  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageName, setImageName] = useState('')
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const files = event.target.files
    if (files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setImageName(file.name)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleSave = () => {
    if (imagePreview && imageName) {
      const imageDataWithPrefix = `data:image/png;base64,${imagePreview.split(',')[1]}`

      ipcRenderer.send('save-image', { imageData: imageDataWithPrefix, imageName })
      setImagePreview(null)
      alert('Image saved successfully!')
    }
  }

  return (
    <div className="upload-edit-page">
      <div className="upload-container">
        <h2 className="upload-file-title">Upload Your Image</h2>
        <form className="upload-form">
          <div className="upload-area" onClick={handleUploadClick}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
                <p>Drag & drop your image here or click to upload</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="file-input"
              accept="image/*"
              hidden
            />
          </div>
          <div className="button-container-upload">
            <button
              type="button"
              className="save-button"
              disabled={!imagePreview}
              onClick={() => handleSave()}
            >
              Save
            </button>
            <button type="button" className="cancel-button" onClick={() => setImagePreview(null)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Upload
