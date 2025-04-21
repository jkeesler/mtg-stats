import { Login } from '../components/Login/Login'
import useToken from '../components/Login/useToken'
import { useNavigate } from "react-router-dom"

export function LoginPage() {
    const { token, removeToken, setToken } = useToken();
    const navigate = useNavigate();


    if(!token){
        return <Login setToken={setToken} />
    }
    return (
        navigate("/profile")
    )
}