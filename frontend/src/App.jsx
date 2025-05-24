import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'

function App() {

  // Landing Page
  // Home Page
  // Profile Page
  //Booking Page
  // Review/Rating Page

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
