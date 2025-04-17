// import Login from './components/Token/Login'
// import Profile from './components/Token/Profile'
// import Header from './components/Token/Header'

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="App">
//         <Header token={removeToken}/>
//         {!token && token!=="" &&token!== undefined?  
//         <Login setToken={setToken} />
//         :(
//           <>
//             <Routes>
//               <Route exact path="/test" element={<Profile token={token} setToken={setToken}/>}></Route>
//             </Routes>
//           </>
//         )}
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Login } from './pages/Login'
import { Profile } from './pages/Profile'
import { Layout } from './Layout'
import useToken from './components/Login/useToken'

function App() {
  const { token, removeToken, setToken } = useToken();

  if(!token){
    return <Login setToken={setToken} />
  }
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <Router>
      <Routes>
        <Route element={<Layout/>}>
         <Route path="/" element={<Home/>}/>
         <Route path="/profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App