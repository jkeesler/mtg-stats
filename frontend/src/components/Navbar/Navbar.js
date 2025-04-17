import { Link, useNavigate } from "react-router-dom"
import axios from "axios";

export function Navbar(props) {

    const navigate = useNavigate();

    function logMeOut() {
        axios({
          method: "POST",
          url:"http://localhost:5000/logout",
        })
        .then((response) => {
           props.token()
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })}

    return(
        <header className="App-header">
        <button onClick={() => navigate("/")}>
            Home
        </button>
        <button onClick={() => navigate("/profile")}>
            Profile
        </button>
        <button onClick={logMeOut}>
            Logout
        </button>
        </header>
    )
}