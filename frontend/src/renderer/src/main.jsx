import './assets/main.css'

import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './redux/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer autoClose={2000} position="top-center" />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
