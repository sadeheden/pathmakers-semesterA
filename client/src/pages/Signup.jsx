import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
        
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        try {
            const signupResponse = await fetch("http://localhost:4000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: Date.now(),
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });
    
            const signupData = await signupResponse.json();
    
            if (signupResponse.ok && signupData.user) {
                console.log("Signup successful:", signupData);
    
                // Automatically log in the user
                const loginResponse = await fetch("http://localhost:4000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    })
                });
    
                const loginData = await loginResponse.json();
    
                if (loginResponse.ok && loginData.user) {
                    console.log("Login successful:", loginData);
    
                    // Store user session in localStorage
                    localStorage.setItem("user", JSON.stringify(loginData.user));
    
                    // Redirect to /video after signup
                    navigate("/main");
                } else {
                    setErrors({ submit: loginData.error || "Login failed after signup. Try logging in manually." });
                }
            } else {
                setErrors({ submit: signupData.error || "Signup failed. Try again." });
            }
        } catch (error) {
            console.error("Signup/Login error:", error);
            setErrors({ submit: "An error occurred. Please try again." });
        }
    };
    


    return (
        <div className="signupContainer">
            <form className="signupForm" onSubmit={handleSubmit}>
                <h2 className="signupTitle">Create an Account</h2>
                
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
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>

                <div className="formGroup">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>

                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>

                <div className="formGroup">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && (
                        <div className="error">{errors.confirmPassword}</div>
                    )}
                </div>

                {errors.submit && <div className="error">{errors.submit}</div>}

                <button type="submit" className="signupButton">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
