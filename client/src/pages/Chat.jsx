
import React, { useState, useEffect } from "react";
import { ChevronRight, MapPin, Plane, Hotel, Compass, Car, CreditCard, CheckCircle } from "lucide-react";
import "../assets/styles/chat.css";

const TravelPlannerApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [loadedCities, setLoadedCities] = useState([]);
  const [loadedFlights, setLoadedFlights] = useState([]);
  const [loadedHotels, setLoadedHotels] = useState([]);
  const [loadedAttractions, setLoadedAttractions] = useState([]);

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

  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.label === "Trip Summary") {
      const totalPrice = calculateTotalPrice();
      return (
        <div className="summary-step">
          <h2>{step.label}</h2>
          <ul>
            {step.questions.map((q, index) => (
              <li key={index}>
                <strong>{q.prompt}:</strong> {userResponses[q.prompt] || q.value || "Not provided"}
              </li>
            ))}
            <li>
              <strong>Total Price:</strong> ${totalPrice}
            </li>
          </ul>
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === steps.length - 1}
            className="custom-btn"
          >
            Finish <ChevronRight />
          </button>
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
                <input
                  type={q.type}
                  value={userResponses[q.prompt] || ""}
                  onChange={(e) =>
                    setUserResponses({ ...userResponses, [q.prompt]: e.target.value })
                  }
                />
              ) : (
                <select
                value={userResponses[q.prompt] || ""}
                onChange={(e) => {
                  setUserResponses({ ...userResponses, [q.prompt]: e.target.value });
                  
                  if (q.prompt === "Select payment method") {
                    alert(`Simulating ${e.target.value} payment process...`);
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
    disabled={currentStep === steps.length - 1 || !userResponses[steps[currentStep].questions[0]?.prompt]}
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
      </div> 
      */}
    </div>

  );
};

export default TravelPlannerApp;