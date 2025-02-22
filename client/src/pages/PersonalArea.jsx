import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/PersonalArea.css";

const PersonalArea = () => {
    const [activeTab, setActiveTab] = useState("userInfo");
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // State for loading
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [editedUser, setEditedUser] = useState({
        username: "",
        address: "",
        city: "",
        country: "",
        phone: "",
        gender: "Other", // Default to avoid undefined
        membership: "No", // Default No
    });
    
    const [orders, setOrders] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("⚠️ No token found, redirecting to login.");
            navigate("/login");
            return;
        }
        await fetchUser();
        fetchOrders();
    };
    fetchData();
}, []);


    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token"); // Ensure token is retrieved correctly
            if (!token) {
                console.error("No token found, please log in again.");
                return;
            }
    
            const response = await fetch("http://localhost:4000/api/order", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token in headers
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Orders:", data);
            setOrders(data); // ✅ Update orders state
        } catch (error) {
            console.error("Failed to fetch orders:", error.message);
        }
    };
    

    const navigate = useNavigate();

    // Fetch logged-in user from backend
   // Fetch logged-in user from new info storage
   useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem("token");


        if (!token) {
            console.warn("⚠️ No token found, redirecting to login.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/api/info/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,  // ✅ Added token
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ User fetched successfully:", data);
                setUser(data);
                setEditedUser({
                    username: data.username || "",
                    address: data.address || "",
                    city: data.city || "",
                    country: data.country || "",
                    phone: data.phone || "",
                    gender: data.gender || "Other",
                    membership: data.membership || "No",
                });
            } else {
                console.error("⚠️ Failed to fetch user:", response.status);
            }
        } catch (error) {
            console.error("⚠️ Error fetching user data:", error);
        }
    };

    fetchUser();
}, []);


    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

    
        // ✅ Only send fields that have changed
        const updatedData = {};
        for (const key in editedUser) {
            if (editedUser[key] !== user[key]) {
                updatedData[key] = editedUser[key]; // ✅ Only add changed fields
            }
        }
    
        console.log("🔍 Sending update:", updatedData); // ✅ Debugging
    
        try {
            const response = await fetch("http://localhost:4000/api/info/user", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData) // ✅ Now sends only changed fields
            });
    
            const result = await response.json();
            console.log("🔍 Server response:", result); // ✅ Debugging
    
            if (response.ok) {
                setUser(result);
                setEditedUser(result);
                setIsEditing(false);
                console.log("✅ Profile updated successfully.");
            } else {
                console.error("⚠️ Failed to update profile:", result);
                alert("⚠️ Error updating profile: " + (result.message || "Please try again."));
            }
        } catch (error) {
            console.error("⚠️ Error updating profile:", error);
            alert("⚠️ An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleLogout = () => {
        localStorage.removeItem("token");
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
        <label>Username</label>
        <input
    type="text"
    value={editedUser.username || ""}
    onChange={(e) =>
        setEditedUser({ ...editedUser, username: e.target.value })
    }
    placeholder="Enter username"
/>


        <label>Address</label>
        <input
    type="text"
    value={editedUser.address || ""}
    onChange={(e) =>
        setEditedUser({ ...editedUser, address: e.target.value })
    }
/>

        <label>City</label>
        <input
            type="text"
            value={editedUser.city}
            onChange={(e) =>
                setEditedUser({ ...editedUser, city: e.target.value })
            }
            placeholder="Enter your city"
        />

        <label>Country</label>
        <input
            type="text"
            value={editedUser.country}
            onChange={(e) =>
                setEditedUser({ ...editedUser, country: e.target.value })
            }
            placeholder="Enter your country"
        />

        <label>Phone Number</label>
        <input
            type="tel"
            value={editedUser.phone}
            onChange={(e) =>
                setEditedUser({ ...editedUser, phone: e.target.value })
            }
            placeholder="Enter phone number"
        />

        <label>Gender</label>
        <select
            value={editedUser.gender}
            onChange={(e) =>
                setEditedUser({ ...editedUser, gender: e.target.value })
            }
        >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>
        <label>Membership</label>
<div className="membership-options" style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ fontSize: "12px", marginBottom: "5px" }}>
        <input
            type="radio"
            name="membership"
            value="Yes"
            checked={editedUser.membership === "Yes"}
            onChange={(e) =>
                setEditedUser({ ...editedUser, membership: e.target.value })
            }
            style={{ transform: "scale(0.8)", marginRight: "5px" }} // ✅ Smaller
        />
        Yes
    </label>
    <label style={{ fontSize: "12px", marginBottom: "5px" }}>
        <input
            type="radio"
            name="membership"
            value="No"
            checked={editedUser.membership === "No"}
            onChange={(e) =>
                setEditedUser({ ...editedUser, membership: e.target.value })
            }
            style={{ transform: "scale(0.8)", marginRight: "5px" }} // ✅ Smaller
        />
        No
    </label>
</div>



        <button onClick={handleSaveProfile} className="button">Save</button>
    </>
) : (
    <>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Address:</strong> {user.address || "Not provided"}</p>
        <p><strong>City:</strong> {user.city || "Not provided"}</p>
        <p><strong>Country:</strong> {user.country || "Not provided"}</p>
        <p><strong>Phone Number:</strong> {user.phone || "Not provided"}</p>
        <p><strong>Gender:</strong> {user.gender || "Not provided"}</p>
        <p><strong>Membership:</strong> {user.membership === "Yes" ? "✅ Yes" : "❌ No"}</p>
        
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
        {orders.length > 0 ? (
            <ul className="orders-list">
                {orders.map((order) => (
                    <li key={order._id} className="order-item">
                        <span>
                            <strong>Order #{order._id}:</strong> {order.departureCity} → {order.destinationCity}, ${order.totalPrice}
                        </span>
                        <a
                            href={`http://localhost:4000/api/order/${order._id}/pdf`}
                            className="download-pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            📄 Download PDF
                        </a>
                    </li>
                ))}
            </ul>
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
            className="newsletter-input"  // ✅ Apply new styling
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe} className="newsletter-button" disabled={loading}>
            {loading ? "Subscribing..." : "Subscribe"}
        </button>
    </>
)}

            </div>
        </div>
    );
};

export default PersonalArea;
