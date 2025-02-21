
import React, { useState, useEffect } from "react";
import { ChevronRight, MapPin, Plane, Hotel, Compass, Car, CreditCard, CheckCircle } from "lucide-react";
import "../assets/styles/chat.css";

const TravelPlannerApp = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep !== null ? parseInt(savedStep) : 0; // Ensure it doesn't return NaN
  });
  
  // Save currentStep to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);
  
  const [userResponses, setUserResponses] = useState(() => {
    const savedResponses = localStorage.getItem("userResponses");
    return savedResponses ? JSON.parse(savedResponses) : {};
  });
  
  // Save responses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userResponses", JSON.stringify(userResponses));
  }, [userResponses]);
  
  const [loadedCities, setLoadedCities] = useState([]);
  const [loadedFlights, setLoadedFlights] = useState([]);
  const [loadedHotels, setLoadedHotels] = useState([]);
  const [loadedAttractions, setLoadedAttractions] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
const [paymentCompleted, setPaymentCompleted] = useState(false);


  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("http://localhost:4000/api/cities");
        if (!response.ok) {
          throw new Error(`Failed to fetch cities, status: ${response.status}`);
        }
        const data = await response.json();
        setLoadedCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }

    async function fetchFlights(city) {
      try {
        const response = await fetch(`http://localhost:4000/api/flights/${city}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch flights, status: ${response.status}`);
        }
        const data = await response.json();
        setLoadedFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    }

    async function fetchHotels(city) {
      if (!city) return;
      try {
        const response = await fetch(`http://localhost:4000/api/hotels/${city}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch hotels, status: ${response.status}`);
        }
        const data = await response.json();
        setLoadedHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    async function fetchAttractions(city) {
      if (!city) return;
      try {
        const response = await fetch(`http://localhost:4000/api/attractions/${city.toLowerCase()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch attractions for ${city}, status: ${response.status}`);
        }
        const data = await response.json();
        setLoadedAttractions(data.attractions || []);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    }

    async function fetchData() {
      await Promise.all([
        fetchCities(),
        userResponses["What is your destination city?"] &&
          fetchFlights(userResponses["What is your destination city?"]),
        userResponses["What is your destination city?"] && fetchHotels(userResponses["What is your destination city?"]),
        userResponses["What is your destination city?"] && fetchAttractions(userResponses["What is your destination city?"]),
      ]);
    }

    fetchData();
  }, [userResponses["What is your destination city?"]]);

  const calculateTotalPrice = () => {
    let total = 0;

    // חישוב מחיר טיסה
    const selectedFlight = userResponses["Select your flight"];
    if (selectedFlight) {
      const flightPrice = parseInt(selectedFlight.split("$")[1]?.split(" ")[0]);
      total += flightPrice || 0;
    }

    // חישוב מחיר מלון
    const selectedHotel = userResponses["Select your hotel"];
    if (selectedHotel) {
      const hotelPrice = parseInt(selectedHotel.split("$")[1]?.split("/")[0]);
      total += hotelPrice || 0;
    }

    // חישוב עלות אטרקציות
    const selectedAttractions = userResponses["Select attractions to visit"];
    if (selectedAttractions) {
      const attractionPrice = 20 * selectedAttractions.split(",").length; // דוגמה למחיר אטרקציות
      total += attractionPrice || 0;
    }

    // חישוב תחבורה
    const selectedTransportation = userResponses["Select your mode of transportation"];
    if (selectedTransportation) {
      const transportationPrice = selectedTransportation === "Car" ? 50 : 10; // דוגמה למחיר תחבורה
      total += transportationPrice || 0;
    }

    return total;
  };

  const steps = [
    {
      label: "Destination",
      icon: MapPin,
      questions: [
        { prompt: "What is your departure city?", options: loadedCities.length ? loadedCities : ["Loading..."] },
        { prompt: "What is your destination city?", options: loadedCities.length ? loadedCities : ["Loading..."] },
      ],
    },
    {
      label: "Flight",
      icon: Plane,
      questions: [
        { prompt: "Travel dates (departure)?", type: "date" },
        { prompt: "Travel dates (return)?", type: "date" },
        {
          prompt: "Select your flight",
          options:
            loadedFlights.length
              ? loadedFlights
                  .find((flight) => flight.city === userResponses["What is your destination city?"])
                  ?.airlines.map((airline) => `${airline.name} - $${airline.price} (${airline.duration})`) || []
              : ["Loading..."],
        },
        { prompt: "Class preference", options: ["Economy", "Business", "First"] },
      ],
    },
    {
      label: "Hotel",
      icon: Hotel,
      questions: [
        {
          prompt: "Select your hotel",
          options:
            loadedHotels.length
              ? loadedHotels.map((hotel) => `${hotel.name} - $${hotel.price}/night`)
              : ["No hotels available"],
        },
        { prompt: "Budget range per night?", type: "text" },
        { prompt: "Accessibility requirements?", options: ["None", "Wheelchair Access", "Ground Floor", "Special Assistance"] },
        { prompt: "Pet-friendly options?", options: ["Yes", "No"] },
      ],
    },
    {
      label: "Attractions",
      icon: Compass,
      questions: [
        {
          prompt: "Select attractions to visit",
          options: loadedAttractions.length ? loadedAttractions : ["No attractions available"],
        },
        { prompt: "Budget for daily activities?", type: "text" },
        { prompt: "Interest areas?", options: ["History", "Food", "Nightlife", "Nature", "Culture"] },
        { prompt: "Group type?", options: ["Solo", "Couple", "Family", "Friends"] },
        { prompt: "Tour preference?", options: ["Guided Tours", "Self-Guided"] },
      ],
    },
    {
      label: "Payment",
      icon: CreditCard,
      questions: [
        {
          prompt: "Select payment method",
          options: ["Credit Card", "PayPal", "Bank Transfer", "Crypto"],
        },
        {
          prompt: "Do you have a promo code?",
          type: "text",
        },
      ],
    }
    ,
    {
      label: "Transportation",
      icon: Car,
      questions: [
        { prompt: "Select your mode of transportation", options: ["Car", "Public Transport", "Bike", "Walk"] },
        { prompt: "Do you need an airport transfer?", options: ["Yes", "No"] },
      ],
    },
    {
      label: "Trip Summary",
      icon: CheckCircle,
      questions: [
        { prompt: "Departure city", value: userResponses["What is your departure city?"] },
        { prompt: "Destination city", value: userResponses["What is your destination city?"] },
        { prompt: "Flight", value: userResponses["Select your flight"] },
        { prompt: "Hotel", value: userResponses["Select your hotel"] },
        { prompt: "Attractions", value: userResponses["Select attractions to visit"] },
        { prompt: "Transportation", value: userResponses["Select your mode of transportation"] },
        { prompt: "Payment method", value: userResponses["Select payment method"] },
        { prompt: "Total Price", value: `$${calculateTotalPrice()}` },
      ],
    },
  ];

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
    </div>
  );

  // Define PaymentModal first// Define PaymentModal first
  const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess, userResponses }) => {
    const [cardNumber, setCardNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState("");
  
    const handlePayment = () => {
      const departureDateStr = userResponses["Travel dates (departure)?"];
      const returnDateStr = userResponses["Travel dates (return)?"];
  
      // Validate Dates
      if (!departureDateStr || !returnDateStr) {
        setError("Please select both departure and return dates.");
        return;
      }
  
      const departureDate = new Date(departureDateStr);
      const returnDate = new Date(returnDateStr);
  
      if (departureDate >= returnDate) {
        setError("Return date must be after departure date.");
        return;
      }
  
      // Validate Payment Details
      if (!/^\d{16}$/.test(cardNumber)) {
        setError("Invalid Card Number. It should be exactly 16 digits.");
        return;
      }
  
      if (!fullName.trim() || fullName.trim().length < 3) {
        setError("Invalid Name. Please enter a valid full name.");
        return;
      }
  
      if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiryDate)) {
        setError("Invalid Expiry Date. Format should be MM/YYYY.");
        return;
      }
  
      if (!/^\d{3}$/.test(cvv)) {
        setError("Invalid CVV. It should be exactly 3 digits.");
        return;
      }
  
      // If everything is valid
      setPaymentSuccess(true);
      setError("");
  
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
        onPaymentSuccess();
      }, 2000);
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {paymentSuccess ? (
            <>
              <h2>🎉 Payment Successful! 🎉</h2>
              <p>Your payment of <strong>${totalAmount}</strong> has been processed.</p>
            </>
          ) : (
            <>
              <h2>Credit Card Payment</h2>
              {error && <p className="error-message">{error}</p>}
              
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} // Only allow numbers
              />
  
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
  
              <div className="expiry-cvv">
                <div>
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YYYY" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div>
                  <label>CVV</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                  />
                </div>
              </div>
  
              <button className="pay-button" onClick={handlePayment} disabled={paymentSuccess}>
                {paymentSuccess ? "Processing..." : `Pay $${totalAmount}`}
              </button>
              <button className="change-payment" onClick={onClose}>Change payment method</button>
            </>
          )}
        </div>
      </div>
    );
  };
  

  
  
  
  const renderStepContent = () => {
    const step = steps[currentStep];
  
    if (step.label === "Trip Summary") {
      const totalPrice = calculateTotalPrice();
  
      const handleDownloadSummary = () => {
        const summaryText = `
        === Trip Summary ===
        Departure City: ${userResponses["What is your departure city?"] || "N/A"}
        Destination City: ${userResponses["What is your destination city?"] || "N/A"}
        Flight: ${userResponses["Select your flight"] || "N/A"}
        Hotel: ${userResponses["Select your hotel"] || "N/A"}
        Attractions: ${userResponses["Select attractions to visit"] || "N/A"}
        Transportation: ${userResponses["Select your mode of transportation"] || "N/A"}
        Payment Method: ${userResponses["Select payment method"] || "N/A"}
        Total Price: $${totalPrice}
        ===================
        `;
  
        const blob = new Blob([summaryText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "trip_summary.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  
      return (
        <div className="trip-summary-container">
          <div className="summary-box">
            <h2>Trip Summary</h2>
            <div className="summary-details">
              <p><strong>Departure City:</strong> {userResponses["What is your departure city?"] || "N/A"}</p>
              <p><strong>Destination City:</strong> {userResponses["What is your destination city?"] || "N/A"}</p>
              <p><strong>Flight:</strong> {userResponses["Select your flight"] || "N/A"}</p>
              <p><strong>Hotel:</strong> {userResponses["Select your hotel"] || "N/A"}</p>
              <p><strong>Attractions:</strong> {userResponses["Select attractions to visit"] || "N/A"}</p>
              <p><strong>Transportation:</strong> {userResponses["Select your mode of transportation"] || "N/A"}</p>
              <p><strong>Payment Method:</strong> {userResponses["Select payment method"] || "N/A"}</p>
              <h3>Total Price: ${totalPrice}</h3>
            </div>
  
            <div className="summary-buttons">
              <button className="download-btn" onClick={handleDownloadSummary}>Download Summary</button>
              <button className="personal-area-btn" onClick={() => window.location.href = "/personal-area"}>
                Go to Personal Area
              </button>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="step">
        <div className="step-header">
          <step.icon />
          <h2>{step.label}</h2>
        </div>
        <div className="step-content">
          {step.questions.map((q, index) => (
            <div key={index}>
              <label>{q.prompt}</label>
              {q.type === "text" || q.type === "date" ? (
                <>
                  {/* Handle Departure Date */}
                  {q.prompt.includes("departure") && (
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]} // Disable past dates
                      value={userResponses[q.prompt] || ""}
                      onChange={(e) => {
                        setUserResponses({
                          ...userResponses,
                          [q.prompt]: e.target.value,
                        });
                      }}
                    />
                  )}
  
                  {/* Handle Return Date */}
                  {q.prompt.includes("return") && (
                <input
                type="date"
                min={userResponses["Travel dates (departure)?"] || new Date().toISOString().split("T")[0]}
                value={userResponses[q.prompt] || ""}
                onChange={(e) => setUserResponses({ ...userResponses, [q.prompt]: e.target.value })}
                disabled={!userResponses["Travel dates (departure)?"]}
              />
              
                  )}
  
                  {/* Handle Other Inputs */}
                  {!q.prompt.includes("departure") && !q.prompt.includes("return") && (
                    <input
                      type={q.type}
                      value={userResponses[q.prompt] || ""}
                      onChange={(e) =>
                        setUserResponses({ ...userResponses, [q.prompt]: e.target.value })
                      }
                    />
                  )}
                </>
              ) : (
                <select
                  value={userResponses[q.prompt] || ""}
                  onChange={(e) => {
                    setUserResponses({ ...userResponses, [q.prompt]: e.target.value });
  
                    if (q.prompt === "Select payment method" && !paymentCompleted) {
                      setIsPaymentModalOpen(true); // Open payment modal only if not paid
                    }
                  }}
                >
                  <option value="" disabled>Select an option</option>
                  {q.options &&
                    q.options.length > 0 &&
                    q.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <div className="navigation-buttons">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
            className="custom-btn1"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={
              currentStep === steps.length - 1 ||
              (steps[currentStep]?.questions?.length > 0 && !userResponses[steps[currentStep].questions[0]?.prompt]) ||
              (step.label === "Flight" && (!userResponses["Travel dates (departure)?"] || !userResponses["Travel dates (return)?"]))
            }
            
            className="custom-btn2"
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="containerCh">
      <header>
        <h1>Travel Planner</h1>
        {renderProgressBar()}
      </header>
      {renderStepContent()}
      <PaymentModal 
      isOpen={isPaymentModalOpen} 
      onClose={() => setIsPaymentModalOpen(false)} 
      onPaymentSuccess={() => {
        setPaymentCompleted(true);
        setCurrentStep((prev) => prev + 1); // Move to Transportation step
      }}
      totalAmount={calculateTotalPrice()} 
      userResponses={userResponses}
    />


{/* <div className="action-buttons">
  <button
    onClick={() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        alert("Thank you for booking!");
        handleSaveOrder({
          id: new Date().getTime(),
          details: JSON.stringify(userResponses),
          status: "Confirmed",
        });
      }
    }}
  >
    {currentStep === steps.length - 1 ? "Confirm & Book" : "Next Step"}
  </button>
</div> */}

    </div>

  );
};

export default TravelPlannerApp;