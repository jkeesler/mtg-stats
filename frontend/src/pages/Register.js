import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function RegisterPage(props) {

    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();

    const validatePassword = () => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validatePassword()) {
            axios({
            method: "POST",
            url: "http://localhost:5000/register",
            data: {
                username: username,
                password: password
                }
            })
            .then((response) => {
                if (response.data.created == 'false'){
                    setUsernameError("This username is already in use, please try again.")
                }
                if (response.data.created == 'true'){
                    setUsernameError("")
                    navigate("/Login")
                }
            }).catch((error) => {
                console.log(error.response)
            })
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validatePassword}
                    required
                />
            </div>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            <button type="submit">Submit</button>
        </form>
    )
}