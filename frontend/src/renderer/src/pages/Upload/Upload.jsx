import './Upload.css'
import uploadIcon from '../../assets/uploadIcon.svg'
import { useRef, useState } from 'react'

const Upload = () => {
  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)

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
      }
      reader.readAsDataURL(file)
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
            <button type="button" className="save-button">
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
