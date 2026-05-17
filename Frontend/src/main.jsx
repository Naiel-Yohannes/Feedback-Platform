import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid #3f3f46',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#18181b' },
          },
          error: {
            iconTheme: { primary: '#fb7185', secondary: '#18181b' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
