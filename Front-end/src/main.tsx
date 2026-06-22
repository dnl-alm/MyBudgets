import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/globals.css'
import { App } from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root não encontrado.')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)