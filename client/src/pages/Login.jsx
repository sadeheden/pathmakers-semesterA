import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '', // Changed from email to username (matching server)
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
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Login successful:", data);
                window.location.href = "/main"; // Refresh and navigate
            } else {
                setError("Invalid username or password.");
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
