import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f1f5f9',
            border: '1px solid #1e2d45',
            borderRadius: '6px',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#f59e0b', secondary: '#0b0f1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0b0f1a' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
)
