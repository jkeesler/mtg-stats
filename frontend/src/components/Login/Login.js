import React from "react"
import "../../css/login.css"
import { useState } from 'react';
import axios from "axios";
import useToken from './useToken';

export function Login(props) {

  const { token, removeToken, setToken } = useToken();

  const [loginForm, setloginForm] = useState({
    username: "",
    password: ""
  })

  function logMeIn(event) {
    axios({
      method: "POST",
      url:"http://localhost:5000/token",
      data:{
        username: loginForm.username,
        password: loginForm.password
       }
    })
    .then((response) => {
      props.setToken(response.data.access_token)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })

    setloginForm(({
      username: "",
      password: ""}))

    event.preventDefault()
  }

  function handleChange(event) { 
    const {value, name} = event.target
    setloginForm(prevNote => ({
        ...prevNote, [name]: value})
    )}

  return (
    <div className="login-wrapper">
    <h1>Please Log In</h1>
    <form className="login">
      <label>
        <p>Username</p>
        <input onChange={handleChange}
               type="username"
               name="username"
               placeholder="Username"
               value={loginForm.username} />
      </label>
      <label>
        <p>Password</p>
        <input onChange={handleChange} 
               type="password"
               name="password"
               placeholder="Password"
               value={loginForm.password} />
      </label>
      <div>
        <button onClick={logMeIn}>Submit</button>
      </div>
    </form>
  </div>
  )
}

export default Login