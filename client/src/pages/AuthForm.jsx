import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AuthForm.css";

const AuthForm = ({ isLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        isLogin
            ? { username: "", password: "" }
            : { username: "", email: "", password: "", confirmPassword: "", profileImage: null }
    );
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null); // For image preview

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));

        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: "" }));
        }
    };

    // Handle file input
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, profileImage: file }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Validate signup form
    const validateForm = () => {
        if (isLogin) return {};
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
        if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
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
            let profileImageUrl = "https://res.cloudinary.com/dnnmhrsja/image/upload/v1700000000/default_profile.jpg"; // Default image
    
            if (formData.profileImage) {
                const imageData = new FormData();
                imageData.append("file", formData.profileImage);
                imageData.append("upload_preset", "your_cloudinary_preset"); // ✅ Ensure you use the correct preset!
    
                const imageResponse = await fetch("http://localhost:4000/api/upload/single", {
                    method: "POST",
                    body: imageData,
                });
    
                const imageResult = await imageResponse.json();
    
                if (imageResponse.ok && imageResult.url) {  // ✅ Use `url` instead of `secure_url`
                    profileImageUrl = imageResult.url;
                } else {
                    console.warn("🚨 Cloudinary upload response:", imageResult);
                    setErrors({ submit: "⚠️ Profile image upload failed. Try again." });
                    return; // ✅ Prevent form submission if the upload failed
                }
            }
    
            const requestBody = isLogin
                ? { username: formData.username, password: formData.password }
                : { username: formData.username, email: formData.email, password: formData.password, profileImage: profileImageUrl };
    
            const url = isLogin
                ? "http://localhost:4000/api/auth/login"
                : "http://localhost:4000/api/auth/register";
    
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("authToken", data.token);
                navigate("/main");
            } else {
                console.error("❌ Registration/Login failed:", data);
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
                    <input type="text" id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>

                {!isLogin && (
                    <>
                        <div className="formGroup">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="profileImage">Profile Picture (Optional)</label>
                            <input type="file" id="profileImage" accept="image/*" onChange={handleFileChange} />
                            {preview && <img src={preview} alt="Preview" className="previewImage" />}
                        </div>
                    </>
                )}

                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                {!isLogin && (
                    <div className="formGroup">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                )}

                <button type="submit" className="authButton">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
        </div>
    );
};

export default AuthForm;
