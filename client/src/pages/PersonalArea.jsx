import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/PersonalArea.css";

const PersonalArea = () => {
    const [activeTab, setActiveTab] = useState("userInfo");
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
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
        console.log("Edit profile clicked");
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
                        <button className="download-btn" onClick={() => handleDownloadOrder(order)}>
                            Download Order
                        </button>
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
                        <button onClick={handleSubscribe} className="buttonP">Subscribe</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalArea;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/styles/PersonalArea.css";

// const PersonalArea = () => {
//     const [activeTab, setActiveTab] = useState("userInfo"); // Default tab
//     const [user, setUser] = useState(null); // Stores logged-in user data
//     const navigate = useNavigate();

//     // Fetch logged-in user from backend
//     useEffect(() => {
//         const fetchUser = async () => {
//             const token = localStorage.getItem("authToken"); // Get token from storage

//             if (!token) {
//                 console.warn("⚠️ No token found, redirecting to login.");
//                 navigate("/login");
//                 return;
//             }

//             try {
//                 const response = await fetch("http://localhost:4000/api/auth/user", {
//                     method: "GET",
//                     headers: {
//                         "Authorization": `Bearer ${token}`, // Include authentication token
//                         "Content-Type": "application/json"
//                     }
//                 });

//                 const data = await response.json();
//                 if (response.ok) {
//                     setUser(data); // Set user data from backend
//                 } else {
//                     console.error("⚠️ Failed to fetch user:", response.status);
//                     setUser(null);
//                     navigate("/login"); // Redirect if not authenticated
//                 }
//             } catch (error) {
//                 console.error("⚠️ Error fetching user data:", error);
//                 setUser(null);
//                 navigate("/login");
//             }
//         };

//         fetchUser(); // Load user data when component mounts
//     }, [navigate]);

//     const handleEditProfile = () => {
//         console.log("Edit profile clicked");
//         // Implement profile editing logic
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("authToken"); // Remove token from storage
//         setUser(null); // Reset React state
//         navigate("/login"); // Redirect to login
//     };

//     return (
//         <div>
//             <h1 className="page-title">Personal Area</h1>

//             {/* Tab Navigation */}
//             <div className="tab-buttons">
//                 <button onClick={() => setActiveTab("userInfo")} className={activeTab === "userInfo" ? "active" : ""}>
//                     User Info
//                 </button>
//                 <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>
//                     Previous Orders
//                 </button>
//                 <button onClick={() => setActiveTab("newsletter")} className={activeTab === "newsletter" ? "active" : ""}>
//                     Sign Up for Newsletter
//                 </button>
//             </div>

//             <div className="containerPersonal">
//                 {/* User Information */}
//                 {activeTab === "userInfo" && (
//                     <>
//                         <h2 className="heading">User Details</h2>
//                         <div className="profileInfo">
//                             {user ? (
//                                 <>
//                                     <p><strong>Username:</strong> {user.username}</p>
//                                     <p><strong>Email:</strong> {user.email}</p>
//                                     <p><strong>Status:</strong> Logged in</p>
//                                 </>
//                             ) : (
//                                 <p>Please log in to see your details.</p>
//                             )}
//                         </div>
//                         {user && (
//                             <>
//                                 <button onClick={handleEditProfile} className="button">Edit Profile</button>
//                                 <button onClick={handleLogout} className="button">Logout</button>
//                             </>
//                         )}
//                     </>
//                 )}

//                 {/* User Orders */}
//                 {activeTab === "orders" && (
//                     <>
//                         <h2 className="heading">Previous Orders</h2>
//                         <div className="profileInfo">
//                             <p>Order #12345 - Paris Flight - Completed</p>
//                             <p>Order #67890 - Hotel Reservation - Pending</p>
//                         </div>
//                         <a href="#" className="button">Download Receipt</a>
//                     </>
//                 )}

//                 {/* Newsletter Subscription */}
//                 {activeTab === "newsletter" && (
//                     <>
//                         <h2 className="heading">Sign Up for Newsletter</h2>
//                         <div className="profileInfo">
//                             <p>Get the latest updates and travel deals straight to your inbox!</p>
//                         </div>
                        
//                         <button className="buttonP">Subscribe</button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PersonalArea;
