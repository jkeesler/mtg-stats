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

import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home'
import { Profile } from './pages/Profile'
import { Layout } from './Layout'
import { Login } from './components/Login/Login'

function App() {

  return (
    <div className="wrapper">
      <Router>
      <Routes>
        <Route element={<Layout/>}>
         <Route path="/" element={<Home/>}/>
         <Route path="/profile" element={<Profile/>}/>
         <Route path="/login" element={<Login/>}/>
        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App