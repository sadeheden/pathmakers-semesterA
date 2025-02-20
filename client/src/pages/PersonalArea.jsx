import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/PersonalArea.css";

const PersonalArea = () => {
    const [activeTab, setActiveTab] = useState("userInfo");
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // State for loading
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [editedUser, setEditedUser] = useState({ username: "", email: "" });
    const navigate = useNavigate();

    // Fetch logged-in user from backend
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authToken");

            if (!token) {
                console.warn("⚠️ No token found, redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:4000/api/auth/user", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                    setEditedUser({ username: data.username, email: data.email });
                } else {
                    console.error("⚠️ Failed to fetch user:", response.status);
                    setUser(null);
                    navigate("/login");
                }
            } catch (error) {
                console.error("⚠️ Error fetching user data:", error);
                setUser(null);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        if (!editedUser.username || !editedUser.email) {
            alert("⚠️ All fields are required!");
            return;
        }

        setLoading(true);

        const token = localStorage.getItem("authToken");

        try {
            const response = await fetch("http://localhost:4000/api/auth/user", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editedUser)
            });

            if (response.ok) {
                // עדכון בשרת הצליח - נקבל את המידע המעודכן
                const updatedUser = await response.json();
                setUser(updatedUser); // עדכון ה-user עם המידע החדש
                setEditedUser({ username: updatedUser.username, email: updatedUser.email }); // עדכון גם בערכים המעודכנים
                setIsEditing(false); // יציאה ממצב עריכה
            } else {
                alert("⚠️ Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("⚠️ Error updating profile:", error);
            alert("⚠️ An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        navigate("/login");
    };

    const handleSubscribe = async () => {
        if (!email.trim()) {
            alert("⚠️ Please enter a valid email.");
            return;
        }

        setLoading(true); // Set loading to true when starting the request

        try {
            const response = await fetch("http://localhost:4000/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                alert("✅ Subscription successful, check your inbox!");
                setEmail(""); // Clear input after success
            } else {
                const errorData = await response.json();
                console.error("⚠️ Failed to subscribe:", errorData.message || response.status);
                alert("⚠️ Failed to subscribe. " + (errorData.message || "Please try again."));
            }
        } catch (error) {
            console.error("⚠️ Error during subscription:", error);
            alert("⚠️ An error occurred. Please try again later.");
        } finally {
            setLoading(false); // Set loading to false after request finishes
        }
    };

    return (
        <div>
            <h1 className="page-title">Personal Area</h1>
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
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedUser.username}
                                                onChange={(e) =>
                                                    setEditedUser({ ...editedUser, username: e.target.value })
                                                }
                                                placeholder="Username"
                                            />
                                            <input
                                                type="email"
                                                value={editedUser.email}
                                                onChange={(e) =>
                                                    setEditedUser({ ...editedUser, email: e.target.value })
                                                }
                                                placeholder="Email"
                                            />
                                            <button onClick={handleSaveProfile} className="button">Save</button>
                                        </>
                                    ) : (
                                        <>
                                            <p><strong>Username:</strong> {user.username}</p>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Status:</strong> Logged in</p>
                                            <button onClick={handleEditProfile} className="button">Edit Profile</button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>Please log in to see your details.</p>
                            )}
                        </div>
                        {user && (
                            <button onClick={handleLogout} className="button">Logout</button>
                        )}
                    </>
                )}

                {/* User Orders */}
                {activeTab === "orders" && (
                    <>
                        <h2 className="heading">Previous Orders</h2>
                        {user && user.orders && user.orders.length > 0 ? (
                            user.orders.map((order, index) => (
                                <div key={index} className="order-summary">
                                    <h3>Trip Order #{index + 1}</h3>
                                    <p><strong>Departure City:</strong> {order.departureCity}</p>
                                    <p><strong>Destination City:</strong> {order.destinationCity}</p>
                                    <p><strong>Flight:</strong> {order.flight}</p>
                                    <p><strong>Hotel:</strong> {order.hotel}</p>
                                    <p><strong>Attractions:</strong> {order.attractions}</p>
                                    <p><strong>Transportation:</strong> {order.transportation}</p>
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                    <h3>Total Price: ${order.totalPrice}</h3>
                                </div>
                            ))
                        ) : (
                            <p>No previous orders found.</p>
                        )}
                    </>
                )}

                {/* Newsletter Subscription */}
                {activeTab === "newsletter" && (
                    <>
                        <h2 className="heading">Sign Up for Newsletter</h2>
                        <div className="profileInfo">
                            <p>Get the latest updates and travel deals straight to your inbox!</p>
                        </div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="newsletter-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSubscribe} className="buttonP" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalArea;
