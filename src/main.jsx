import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

const params = new URLSearchParams(window.location.search);
const view = params.get('view');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {view === 'responses' ? <AdminDashboard /> : <App />}
  </StrictMode>,
)
