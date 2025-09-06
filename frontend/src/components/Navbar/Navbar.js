import { useNavigate } from "react-router-dom"
import axios from "axios";
import useToken from "../Login/useToken";

export function Navbar(props) {
    
    const { token, removeToken, setToken } = useToken();
    const userToken = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        logMeOut();
        removeToken();
        navigate("/");
    }

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

    function logoutOrLogin() {
        if (!userToken){
            return (
                <>
                    <button className="nav-button" onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button className="nav-button" onClick={() => navigate("/register")}>
                        Register
                    </button>
                </>

            )
        }
        else {
            return (
                <button className="nav-button" onClick={handleLogout}>
                    Logout
                </button>
            )
        }
    }

    return(
        <header className="App-header">
        <button className="nav-button" onClick={() => navigate("/")}>
            Home
        </button>
        <button className="nav-button" onClick={() => navigate("/profile")}>
            Profile
        </button>
        {logoutOrLogin()}
        </header>
    )
}