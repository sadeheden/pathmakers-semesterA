import React, { useState, useEffect } from "react";
import { ChevronRight, MapPin, Plane, Hotel, Compass, Car, CreditCard, CheckCircle } from "lucide-react";
import "../components/chat.css";

const TravelPlannerApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [loadedCities, setLoadedCities] = useState([]);
  const [loadedFlights, setLoadedFlights] = useState([]);
  const [loadedHotels, setLoadedHotels] = useState([]);
  const [loadedAttractions, setLoadedAttractions] = useState([]);
  const [loadedTransportation, setLoadedTransportation] = useState([]);
  const [loadedPaymentOptions, setLoadedPaymentOptions] = useState([]);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("http://localhost:4000/cities");
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
        const response = await fetch(`http://localhost:4000/flights/${city}`);
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
    if (!city) return; // ✅ Prevents fetching if no city is selected
    try {
        console.log(`Fetching hotels for city: ${city}`); // Debugging log
        const response = await fetch(`http://localhost:4000/hotels/${city}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch hotels, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched hotels:", data); // ✅ Logs fetched data
        setLoadedHotels(data);
    } catch (error) {
        console.error("Error fetching hotels:", error);
    }
}
async function fetchData() {
  await Promise.all([
      fetchCities(),
      userResponses["What is your destination city?"] ? fetchFlights(userResponses["What is your destination city?"]) : null,
      userResponses["What is your destination city?"] ? fetchHotels(userResponses["What is your destination city?"]) : null,
      userResponses["What is your destination city?"] ? fetchAttractions(userResponses["What is your destination city?"]) : null,
      fetchTransportation(),
      fetchPaymentOptions(),
  ]);
}


async function fetchAttractions(city) {
  if (!city) return; // Early return if no city selected
  
  try {
    const response = await fetch(`http://localhost:4000/attractions/${city}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch attractions, status: ${response.status}`);
    }
    const data = await response.json();
    setLoadedAttractions(data);
  } catch (error) {
    console.error("Error fetching attractions:", error);
  }
}

    async function fetchTransportation() {
      try {
        const response = await fetch("http://localhost:4000/transportation");
        if (!response.ok) {
          throw new Error(`Failed to fetch transportation, status: ${response.status}`);
        }
        const data = await response.json();
        setLoadedTransportation(data);
      } catch (error) {
        console.error("Error fetching transportation:", error);
      }
    }

    async function fetchPaymentOptions() {
      try {
        const response = await fetch("http://localhost:4000/payment-options");
        if (!response.ok) {
          throw new Error(`Failed to fetch payment options, status: ${response.status}`);
        }
        const data = await response.json();
        setLoadedPaymentOptions(data);
      } catch (error) {
        console.error("Error fetching payment options:", error);
      }
    }

    async function fetchData() {
      await Promise.all([
        fetchCities(),
        userResponses["What is your destination city?"] && fetchFlights(userResponses["What is your destination city?"]),
        userResponses["What is your destination city?"] && fetchHotels(userResponses["What is your destination city?"]),
        userResponses["What is your destination city?"] && fetchAttractions(userResponses["What is your destination city?"]),
        fetchTransportation(),
        fetchPaymentOptions(),
      ]);
    }

    fetchData();
  }, [userResponses]);

  const steps = [
    {
      label: "Destination",
      icon: MapPin,
      questions: [
        { prompt: "What is your departure city?", options: loadedCities.length ? loadedCities : ["Loading..."], },
        {
          prompt: "What is your destination city?",
          options: loadedCities.length ? loadedCities : ["Loading..."],
        },
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
          options: loadedFlights.length
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
          options: loadedHotels.length
            ? loadedHotels.map((hotel) => `${hotel.name} - $${hotel.price}/night`)
            : ["No hotels available"], // ✅ Changed from "Loading..."
        },
        { prompt: "Budget range per night?", type: "text" },
        { prompt: "Accessibility requirements?", options: ["None", "Wheelchair Access", "Ground Floor", "Special Assistance"] },
        { prompt: "Pet-friendly options?", options: ["Yes", "No"] },
      ],
    }
,    
    {
      label: "Attractions",
      icon: Compass,
      questions: [
        {
          prompt: "Select attractions to visit",
          options: loadedAttractions.length
            ? loadedAttractions
                .find((attraction) => attraction.city === userResponses["What is your destination city?"])
                ?.attractions || []
            : ["Loading..."],
        },
        { prompt: "Budget for daily activities?", type: "text" },
        { prompt: "Interest areas?", options: ["History", "Food", "Nightlife", "Nature", "Culture"] },
        { prompt: "Group type?", options: ["Solo", "Couple", "Family", "Friends"] },
        { prompt: "Tour preference?", options: ["Guided Tours", "Self-Guided"] },
      ],
    },
    {
      label: "Transportation",
      icon: Car,
      questions: [
        {
          prompt: "Select your mode of transportation",
          options: loadedTransportation.length
            ? loadedTransportation.map((transport) => `${transport.type} - $${transport.price}`)
            : ["Loading..."],
        },
        { prompt: "Do you need airport transfer?", options: ["Yes", "No"] },
      ],
    },
    {
      label: "Payment",
      icon: CreditCard,
      questions: [
        {
          prompt: "Select payment method",
          options: loadedPaymentOptions.length
            ? loadedPaymentOptions.map((payment) => payment.method)
            : ["Loading..."],
        },
        { prompt: "Do you have a promo code?", type: "text" },
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
         min={q.prompt === "Travel dates (return)?" ? userResponses["Travel dates (departure)?"] : undefined}
         onChange={(e) => setUserResponses({ ...userResponses, [q.prompt]: e.target.value })}
       />
       
              ) : (
                <select
                  value={userResponses[q.prompt] || ""}
                  onChange={(e) => setUserResponses({ ...userResponses, [q.prompt]: e.target.value })}
                >
                  <option value="" disabled>Select an option</option>
                  {q.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length - 1 || !userResponses[steps[currentStep].questions[0]?.prompt]}
        >
          Next <ChevronRight />
        </button>
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
    </div>
  );
};

export default TravelPlannerApp;
