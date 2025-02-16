import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/PersonalArea.css";

const PersonalArea = () => {
    const [activeTab, setActiveTab] = useState("userInfo"); // Default tab
    const [user, setUser] = useState(null); // Stores logged-in user data
    const navigate = useNavigate();

    // Fetch logged-in user from backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:4000/user"); // Fetch from backend
                const data = await response.json();
                if (response.ok) {
                    setUser(data); // Set user data from backend
                } else {
                    setUser(null); // If no user found, reset state
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null); // Handle errors by resetting user state
            }
        };

        fetchUser(); // Load user data when component mounts
    }, []);

    const handleEditProfile = () => {
        console.log("Edit profile clicked");
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user session
        setUser(null); // Reset React state
        navigate("/login"); // Redirect to login
    };
    
    
    
    return (
        <div>
            {/* Main Title */}
            <h1 className="page-title">Welcome to Your Personal Area</h1>

            {/* Tab Navigation */}
            <div className="tab-buttons">
                <button onClick={() => setActiveTab("userInfo")} className={activeTab === "userInfo" ? "active" : ""}>
                    User Info
                </button>
                <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>
                    Previous Orders
                </button>
                <button onClick={() => setActiveTab("newsletter")} className={activeTab === "newsletter" ? "active" : ""}>
                    Sign Up for Newsletter
                </button>
            </div>

            <div className="containerPersonal">
                {/* User Information */}
                {activeTab === "userInfo" && (
                    <>
                        <h2 className="heading">User Details</h2>
                        <div className="profileInfo">
                            {user ? (
                                <>
                                    <p><strong>Username:</strong> {user.username}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Status:</strong> Logged in</p>
                                </>
                            ) : (
                                <p>Please log in to see your details.</p>
                            )}
                        </div>
                        {user && (
                            <>
                                <button onClick={handleEditProfile} className="button">Edit Profile</button>
                                <button onClick={handleLogout} className="button">Logout</button>
                            </>
                        )}
                    </>
                )}

                {/* User Orders */}
                {activeTab === "orders" && (
                    <>
                        <h2 className="heading">Previous Orders</h2>
                        <div className="profileInfo">
                            <p>Order #12345 - Paris Flight - Completed</p>
                            <p>Order #67890 - Hotel Reservation - Pending</p>
                        </div>
                        <a href="#" className="button">Download Receipt</a>
                    </>
                )}

                {/* Newsletter Subscription */}
                {activeTab === "newsletter" && (
                    <>
                        <h2 className="heading">Sign Up for Newsletter</h2>
                        <div className="profileInfo">
                            <p>Get the latest updates and travel deals straight to your inbox!</p>
                        </div>
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button className="button">Subscribe</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalArea;
