import { useEffect, useState } from 'react';
import { Login } from '../components/Login/Login'
import useToken from '../components/Login/useToken'
import axios from 'axios';

export function ProfilePage() {
    const { token, removeToken, setToken } = useToken();
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "http://localhost:5000/profile",
            headers: {"Authorization" : `Bearer ${token}`}
        })
        .then((response) => setUserData(response.data))
        .catch((error) => {
            console.log(error.response)
        })
    }, [userData])

    if(!token){
        return <Login setToken={setToken} />
    }
    return (
        <>
            <h1>Welcome, {userData.username}</h1>
        </>
    )
}