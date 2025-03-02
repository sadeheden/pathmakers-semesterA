import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/PersonalArea.css";

const PersonalArea = () => {
    const [activeTab, setActiveTab] = useState("userInfo");
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(false); // State for loading
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [editedUser, setEditedUser] = useState({
        username: "",
        birthdate: "", // Store birthdate
        address: "",
        city: "",
        country: "",
        phone: "",
        gender: "Other", // Default to avoid undefined
        membership: "No", // Default No
    });
    
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("⚠️ No token found, please log in again.");
                return;
            }
    
            const response = await fetch("http://localhost:4000/api/order", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("✅ All orders fetched from API:", data);
    
            // ✅ Wait for user to be set before filtering
            if (user && user.id) {
                const userOrders = data.filter(order => String(order.userId) === String(user.id)); 
                console.log("✅ Filtered Orders for User:", userOrders);
                
                // ✅ Filter out duplicate orders (same departure and destination)
                const uniqueOrders = filterUniqueOrders(userOrders);
                console.log("✅ Unique Orders after filtering:", uniqueOrders);
                
                setOrders(uniqueOrders);
            }
        } catch (error) {
            console.error("⚠️ Failed to fetch orders:", error.message);
        }
    };
    
    // ✅ Function to filter out duplicate orders based on departure and destination
    const filterUniqueOrders = (ordersList) => {
        const uniqueOrderMap = new Map();
        
        ordersList.forEach(order => {
            // Create a unique key based on departure and destination
            const orderKey = `${order.departureCity}-${order.destinationCity}`;
            
            // If this combo doesn't exist yet, or if the current order has a higher price
            // (assuming we might want the most recent/expensive one)
            if (!uniqueOrderMap.has(orderKey) || 
                uniqueOrderMap.get(orderKey).totalPrice < order.totalPrice) {
                uniqueOrderMap.set(orderKey, order);
            }
        });
        
        // Convert the map values back to an array
        return Array.from(uniqueOrderMap.values());
    };
    
    // ✅ Ensure fetchOrders runs **only after** the user is set
    useEffect(() => {
        if (user && user.id) {
            console.log("🔍 Fetching orders for user:", user.id);
            fetchOrders();
        }
    }, [user]); // ✅ Runs only when `user` is updated
    
    // ✅ Move `fetchUser` outside of useEffect
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.warn("⚠️ No token found. Redirecting to login...");
                setTimeout(() => navigate("/login"), 1000);
                return;
            }

            const response = await fetch("http://localhost:4000/api/auth/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`⚠️ Failed to fetch user, status: ${response.status}`);
            }

            const userData = await response.json();
            console.log("✅ User fetched successfully:", userData);

            setUser(userData);

            // ✅ Set initial edit state with fetched data
            setEditedUser({
                username: userData.username || "", // ✅ Ensure username is correctly set
                birthdate: userData.birthdate || "",
                address: userData.address || "",
                city: userData.city || "",
                country: userData.country || "",
                phone: userData.phone || "",
                gender: userData.gender || "Other",
                membership: userData.membership || "No",
                age: userData.birthdate ? calculateAge(userData.birthdate) : "Not provided", // ✅ Auto-calculate age
            });

        } catch (error) {
            console.error("⚠️ Error fetching user session:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.warn("⚠️ No token found, redirecting to login.");
                navigate("/login");
                return;
            }
            await fetchUser(); // ✅ Now fetchUser is properly defined
        };
        fetchData();
    }, []);


    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");
    
        // Ensure age is calculated before saving
        const updatedData = { ...editedUser };
    
        if (editedUser.birthdate) {
            updatedData.age = calculateAge(editedUser.birthdate); // ✅ Save calculated age
        }
    
        console.log("🔍 Sending update:", updatedData); // ✅ Debugging
    
        try {
            const response = await fetch("http://localhost:4000/api/info/user", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });
    
            const result = await response.json();
            console.log("🔍 Server response:", result);
    
            if (response.ok) {
                setUser(result); // ✅ Update user state
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
    
    
    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
    };
    
    
    const calculateAge = (birthdate) => {
        if (!birthdate) return "Not provided"; // ✅ Ensures no invalid value
    
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
        // Adjust for cases where the birthday hasn't occurred this year yet
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
    
        return age;
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
                                            <input type="text" value={user.username} disabled /> {/* ❌ Username is now non-editable */}
    
                                            <label>Date of Birth</label>
<input
    type="date"
    value={editedUser.birthdate || ""}
    max={new Date().toISOString().split("T")[0]} 
    onChange={(e) => {
        const birthdate = e.target.value;
        const age = calculateAge(birthdate); // ✅ Automatically update age
        setEditedUser({ ...editedUser, birthdate, age });
    }}
/>

<p><strong>Age:</strong> {editedUser.age || "Not provided"}</p> {/* ✅ Now displays calculated age */}

    
                                            <label>Address</label>
                                            <input
                                                type="text"
                                                value={editedUser.address || ""}
                                                onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                                            />
    
                                            <label>City</label>
                                            <input
                                                type="text"
                                                value={editedUser.city}
                                                onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                                                placeholder="Enter your city"
                                            />
    
                                            <label>Country</label>
                                            <input
                                                type="text"
                                                value={editedUser.country}
                                                onChange={(e) => setEditedUser({ ...editedUser, country: e.target.value })}
                                                placeholder="Enter your country"
                                            />
    
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                value={editedUser.phone}
                                                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                                placeholder="Enter phone number"
                                            />
    
                                            <label>Gender</label>
                                            <select
                                                value={editedUser.gender}
                                                onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
    
                                            <label>Membership</label>
                                            <div className="membership-options">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="membership"
                                                        value="Yes"
                                                        checked={editedUser.membership === "Yes"}
                                                        onChange={(e) =>
                                                            setEditedUser({ ...editedUser, membership: e.target.value })
                                                        }
                                                    />
                                                    Yes
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="membership"
                                                        value="No"
                                                        checked={editedUser.membership === "No"}
                                                        onChange={(e) =>
                                                            setEditedUser({ ...editedUser, membership: e.target.value })
                                                        }
                                                    />
                                                    No
                                                </label>
                                            </div>
    
                                            {/* ✅ Centered Save Button */}
                                            <button onClick={handleSaveProfile} className="button">Save</button>
                                        </>
                                    ) : (
                                        <>
                                        <p><strong>Username:</strong> {user.username} </p> 
                                        <p><strong>Date of Birth:</strong> {user.birthdate ? user.birthdate : "Not provided"}</p> 
                                        <p><strong>Age:</strong> {user.age ? user.age : calculateAge(user.birthdate)}</p> {/* ✅ Always calculate if missing */}
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
                    </>
                )}
    
                {/* User Orders */}
                {selectedOrder && (
    <div className="order-modal">
        <div className="order-modal-content">
            <button className="close-modal" onClick={() => setSelectedOrder(null)}>✖</button>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Departure:</strong> {selectedOrder.departureCity}</p>
            <p><strong>Destination:</strong> {selectedOrder.destinationCity}</p>
            <p><strong>Total Price:</strong> ${selectedOrder.totalPrice}</p>
        </div>
    </div>
)}

    
                {activeTab === "orders" && (
                    <>
                        <h2 className="heading">Your Previous Orders</h2>
                        {orders.length > 0 ? (
                            <>
                                <p className="info-text">      Your previous orders: </p>
                                <ul className="orders-list">
                                    {orders.map((order) => (
                                        <li key={order.id} className="order-item">
                                            <span>
                                                <strong>Route:</strong> {order.departureCity} → {order.destinationCity}, ${order.totalPrice}
                                            </span>
                                            <button className="view-details-button" onClick={() => handleViewOrderDetails(order)}>
                                                View Details
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
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