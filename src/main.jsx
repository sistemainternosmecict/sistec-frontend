import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HostProvider } from './HostContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HostProvider>
      <App />
    </HostProvider>
  </StrictMode>,
)
