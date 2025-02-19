import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AuthForm.css"; // Shared styles for both login & signup

const AuthForm = ({ isLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        isLogin
            ? { username: "", password: "" }
            : { username: "", email: "", password: "", confirmPassword: "" }
    );
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));

        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: "" }));
        }
    };

    // Validate signup form
    const validateForm = () => {
        if (isLogin) return {}; // No validation needed for login

        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
    
        if (!isLogin) {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }
    
        try {
            const url = isLogin
                ? "http://localhost:4000/api/auth/login"
                : "http://localhost:4000/api/auth/register";
    
            const requestBody = isLogin
                ? { username: formData.username, password: formData.password }
                : { username: formData.username, email: formData.email, password: formData.password };
    
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
            console.log("🔹 Response received:", response.status, data);
    
            if (response.ok) {
                console.log("✅ Auth successful:", data);
    
                // ✅ Store token in localStorage
                localStorage.setItem("authToken", data.token);
    
                // ✅ Navigate directly to main page after signup or login
                navigate("/main");
    
            } else {
                setErrors({ submit: data.error || "An error occurred. Try again." });
            }
        } catch (error) {
            console.error("❌ Auth error:", error);
            setErrors({ submit: "An error occurred. Please try again." });
        }
    };
    

    return (
        <div className={`authContainer ${isLogin ? "login" : "signup"}`}>
            <form className="authForm" onSubmit={handleSubmit}>
                <h2 className="authTitle">{isLogin ? "Welcome Back" : "Create an Account"}</h2>

                {errors.submit && <p className="errorText">{errors.submit}</p>}

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
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>

                {!isLogin && (
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
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                )}

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
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                {!isLogin && (
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
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                )}

                <button type="submit" className="authButton">
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p className="toggleText">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <a href="#" onClick={() => navigate(isLogin ? "/signup" : "/login")}>
                        {isLogin ? "Sign up" : "Log in"}
                    </a>
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
