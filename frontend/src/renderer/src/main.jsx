import './assets/main.css'

import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <ToastContainer autoClose={2000} position="top-center" />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Fragment>
)
