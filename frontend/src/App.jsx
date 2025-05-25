import { useState } from 'react'
import './App.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import { SetUp } from './pages/SetUp'

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
          <Route path="/setup" element={<SetUp/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
