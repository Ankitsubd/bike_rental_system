import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NotFound from './components/common/NotFound';
import Home from './pages/Home'
import Layout from './components/common/Layout';
import LoginPage from './pages/auth/LoginPage';
const App = () => {
  return (
  <Router>
    <Layout>
      <Routes>
        <Route path='/' element={<Home/>}/>
       
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Layout>
  </Router>    
  )
}

export default App