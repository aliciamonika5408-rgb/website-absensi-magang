import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext' // 1. Import AuthProvider yang sudah kita buat

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Bungkus App dengan AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)