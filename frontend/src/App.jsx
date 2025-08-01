
import React, { useEffect } from 'react'
import {ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css';
const App = () => {
  useEffect(()=>{
    document.title ='Bike Rental System';
  },[]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastContainer position='top-right' autoClose={3000}/>
        <AppRouter/>
      </AuthProvider>
    </ErrorBoundary>
  )
}


export default App;
