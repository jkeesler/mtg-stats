import { Login } from '../components/Login/Login'
import useToken from '../components/Login/useToken'

export function Profile() {
    const { token, removeToken, setToken } = useToken();

    if(!token){
        return <Login setToken={setToken} />
    }
    return (
        <>
            <h1>This is the profile page</h1>
        </>
    )
}