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

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return setUser(null);

            try {
                const res = await fetch("http://localhost:4000/api/auth/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (res.ok) {
                    setUser(await res.json());
                } else {
                    localStorage.removeItem("authToken");
                    setUser(null);
                }
            } catch (error) {
                localStorage.removeItem("authToken");
                setUser(null);
            }
        };

        fetchUser();
    }, [location]);

    return (
        <header className="header">
            <div className="logo">
                <Link to={user ? "/main" : "#"}>
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            {user && (
                <nav className="navbar">
                    <Link to="/main" className={location.pathname === "/main" ? "active" : ""}>Main</Link>
                    <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
                    <Link to="/video" className={location.pathname === "/video" ? "active" : ""}>Video</Link>
                    <Link to="/DownloadApp" className={location.pathname === "/DownloadApp" ? "active" : ""}>Download App</Link>
                </nav>
            )}

            <div className="profile-section">
                {user ? (
                    <>
                        <img
                            src={user.profileImage || profilePlaceholder}
                            alt="User"
                            className="profile-image"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        />
                        {isProfileOpen && (
                            <div className="profile-popup">
                                <p>Hello, {user.username}!</p>
                                <Link to="/personal-area">Go to Profile</Link>
                                <button onClick={() => localStorage.removeItem("authToken")} className="logoutButton">
                                    Log Out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/login" className="login-button">
                        <span className="icon">🔑</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
