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

    // Fetch User session
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.warn("⚠️ No token found, skipping user fetch.");
            return; 
        }
    
        try {
            const res = await fetch("http://localhost:4000/api/auth/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                console.error(`⚠️ Failed to fetch user: ${res.status}`);
                setUser(null);
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("⚠️ Error fetching user session:", error);
            setUser(null);
        }
    };
    
    
    


    // Trigger user data fetching when route changes
    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [location]);

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Logout failed: ${response.statusText}`);
            }

            console.log("✅ Successfully logged out.");
            localStorage.removeItem("token"); // Clear stored token
            setUser(null);
            navigate("/"); // Redirect to homepage
        } catch (error) {
            console.error("⚠️ Logout error:", error);
        }
    };

    // Define pages to disable the menu
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
            {/* Logo and Navbar */}
            <div className="logo">
                <Link to={isDisabledPage ? "#" : "/main"} className={isDisabledPage ? "disabled-link" : ""}>
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            {!isDisabledPage && user && (
                <nav className={`navbar ${isMenuOpen ? "show" : ""}`}>
                    <Link to="/main">Main</Link>
                    <Link to="/about">About</Link>
                    <Link to="/video">Video</Link>
                    <Link to="/DownloadApp">Download App</Link>
                </nav>
            )}

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
