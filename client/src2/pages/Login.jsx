import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
 
    if (response.ok) {
        localStorage.setItem("token", data.token); // 🔹 Save token after login
        console.log("✅ Login successful:", data);
        window.location.href = "/main"; 
    }
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            // ✅ Define response before using it
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            // ✅ Parse JSON response
            const data = await response.json();
    
            if (response.ok) {
                console.log("✅ Login successful:", data);
                localStorage.setItem("token", data.token); // Store token
                window.location.href = "/main"; // Redirect to main page
            } else {
                setError("❌ Invalid username or password.");
            }
        } catch (error) {
            console.error("🚨 Login error:", error);
            setError("An error occurred. Please try again.");
        }
    };
    

    return (
        <div className="loginContainer">
            <h2 className="loginTitle">Welcome Back</h2>

            {error && <p className="errorText">{error}</p>} {/* Show errors */}

            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="loginButton">
                    Login
                </button>
            </form>

            <p className="signupText">
                Don't have an account?{" "}
                <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
