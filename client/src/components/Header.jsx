import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/Image20250119205452.png";
import profilePlaceholder from "../assets/images/2151100205.jpg";
import "../assets/styles/Header.css";

const Header = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    /* -------------------- ✅ Function to Fetch User Session -------------------- */
    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:4000/users", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
    
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error("⚠️ Failed to fetch user:", response.status);
                setUser(null);
            }
        } catch (error) {
            console.error("⚠️ Error fetching user session:", error);
            setUser(null);
        }
    };
    

    
    /* -------------------- ✅ useEffect for Route Changes -------------------- */
    useEffect(() => {
        if (!user) {  // Prevents unnecessary API calls
            fetchUser();
        }
    }, [location]);

    /* -------------------- ✅ Handle Logout -------------------- */
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:4000/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error(`Logout failed: ${response.statusText}`);
            }
    
            console.log("✅ Successfully logged out.");
            localStorage.removeItem("token"); // 🔹 Clear stored token
            setUser(null);
            navigate("/"); // Redirect to homepage after logout
        } catch (error) {
            console.error("⚠️ Logout error:", error);
        }
    };
    
    

    /* -------------------- ✅ Define Pages to Disable Menu & Logo -------------------- */
    const disabledPages = ["/", "/signup", "/login"];
    const isDisabledPage = disabledPages.includes(location.pathname);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-section")) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <header className="header">
            {/* ✅ Logo remains visible but disabled on About, Signup, and Login pages */}
            <div className="logo">
                <Link to={isDisabledPage ? "#" : "/main"} className={isDisabledPage ? "disabled-link" : ""}>
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            {/* ✅ Navbar: Hidden on About, Signup, and Login pages */}
            {!isDisabledPage && user && (
                <nav className={`navbar ${isMenuOpen ? "show" : ""}`}>
                    <Link to="/main">Main</Link>
                    <Link to="/about">About</Link>
                    <Link to="/video">Video</Link>
                    <Link to="/DownloadApp">Download App</Link>
                </nav>
            )}

            {/* ✅ User Profile Section (Always Visible) */}
            <div className="profile-section">
                <img
                    src={user?.profileImage || profilePlaceholder}
                    alt="User"
                    className="profile-image"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                />
                {isProfileOpen && (
                    <div className="profile-popup">
                        {user ? (
                            <>
                                <p>Hello, {user.username}!</p>
                                <Link to="/personal-area">Go to Profile</Link>
                                <button onClick={handleLogout} className="logoutButton">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <p>Hello, Friend!</p>
                                <Link to="/login">Log in</Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ✅ Hamburger Button for Mocdbile (Hidden before login & on disabled pages) */}
            {!isDisabledPage && user && (
                <button
                    className={`hamburger ${isMenuOpen ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </button>
            )}
        </header>
    );
};

export default Header;