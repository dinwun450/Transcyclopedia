import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import MainConts from './MainConts.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainConts />
  </StrictMode>,
)
