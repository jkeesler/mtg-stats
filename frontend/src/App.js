import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { ProfilePage } from './pages/Profile'
import { Layout } from './Layout'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register';

function App() {

  return (
    <div className="wrapper">
      <Router>
      <Routes>
        <Route element={<Layout/>}>
         <Route path="/" element={<HomePage/>}/>
         <Route path="/profile" element={<ProfilePage/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/register" element={<RegisterPage/>}/>
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App