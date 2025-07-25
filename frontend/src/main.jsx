import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
  <BrowserRouter>
    <App/>
  </BrowserRouter>
  </StrictMode>
=======
    <Router>
      <AuthProvider>
        <App /> 
      </AuthProvider>
    </Router>
  </StrictMode>,
>>>>>>> aac094d2dc79dbd05e79708102d9a3c2ce6bdf16
)
