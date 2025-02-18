import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const url = 'http://localhost:4000/api/auth/login';
    
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Login successful:", data);
                localStorage.setItem('authToken', data.token);
                navigate('/main');
            } else {
                setError(data.error || "Invalid username or password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred. Please try again.");
        }
    };
    
    
    
    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2 className="loginTitle">Welcome Back</h2>

                {error && <p className="errorText">{error}</p>} {/* Show errors */}

                <div className="formGroup">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="loginButton">
                    Login
                </button>

                <p className="signupText">
                    Don't have an account?{' '}
                    <a href="#" onClick={handleSignUp}>
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
