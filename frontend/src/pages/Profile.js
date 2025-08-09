import { useEffect, useState } from 'react';
import { Login } from '../components/Login/Login'
import useToken from '../components/Login/useToken'
import axios from 'axios';

export function ProfilePage() {
    const { token, removeToken, setToken } = useToken();
    const [userData, setUserData] = useState([]);

    const addWin = () => {
        axios({
            method: "POST",
            url: "http://localhost:5000/modify_stats",
            data: {
                action: "add_win"
            },
            headers: {"Authorization" : `Bearer ${token}`}
        })
        .catch((error) => {
            console.log(error.response)
        })
    };
    const addLoss = () => {
        axios({
            method: "POST",
            url: "http://localhost:5000/modify_stats",
            data: {
                action: "add_loss"
            },
            headers: {"Authorization" : `Bearer ${token}`}
        })
        .catch((error) => {
            console.log(error.response)
        })
    };
    const statReset = () => {
        axios({
            method: "POST",
            url: "http://localhost:5000/modify_stats",
            data: {
                action: "reset"
            },
            headers: {"Authorization" : `Bearer ${token}`}
        })
        .catch((error) => {
            console.log(error.response)
        })
    };

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
            <h2>Wins: {userData.wins}</h2>
            <h2>Losses: {userData.losses}</h2>
            <h2>Win Rate: {userData.wins / (userData.wins + userData.losses) * 100 || 0}%</h2>
            <button onClick={addWin}>Add Win</button>
            <button onClick={addLoss}>Add Loss</button>
            <button onClick={statReset}>Reset</button>
        </>
    )
}
test