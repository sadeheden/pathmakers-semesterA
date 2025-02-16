import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function userLogin(event) {
        event.preventDefault();
        console.log("Username: ", username);
        console.log("Password: ", password);

        try {
            //send data to server
            let response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            let data = await response.json();

            console.log('data ==> ', data);
            console.log('response ==> ', response);
        } catch (error) {
            console.log('Error ==> ', error);
        }

    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={userLogin}>
                <input type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value)} />
                <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                <button type="submit">Login</button>
            </form>
            <p>no a member? <Link to="/register">register</Link></p>
        </div>
    );
}