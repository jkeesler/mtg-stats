import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Layout } from './Layout'
import { LoginPage } from './pages/Login'

function App() {

  return (
    <div className="wrapper">
      <Router>
      <Routes>
        <Route element={<Layout/>}>
         <Route path="/" element={<Home/>}/>
         <Route path="/profile" element={<Profile/>}/>
         <Route path="/login" element={<LoginPage/>}/>
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App