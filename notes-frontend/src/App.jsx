import { useState } from 'react'
import './App.css'
// import { Nav } from 'react-bootstrap'
// import NavBar from './components/navbar.jsx'
import LandingPage from './components/landing_pg/landing_pg.jsx'
import Login from './components/login/login.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register.jsx'


function App() {
  

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
