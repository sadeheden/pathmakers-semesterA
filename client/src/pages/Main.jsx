import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/main.css';
import parisVideo from "../assets/images/paris.mp4"; 
import fantasyImg from '../assets/images/fantasy-3502188_1280.jpg';
import airportImg from '../assets/images/airport-2373727_1280.jpg';
import globeImg from '../assets/images/globe-trotter-1828079_1280.jpg';
import uploadedImg from '../assets/images/Image20250611122425.png';





const Main = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChatRedirect = () => {
    console.log('Navigating to chat...');
    navigate('/chat'); // Uncommented this line
  };

  return (
    <div className="main-wrapper">
      <div className="layout-container">
        <div className="main-section">
          <div className="layout-content-container">

            {/* --- Hero Section --- */}
            <div className="hero-section">
              {/* Add the video tag here */}
             <video autoPlay loop muted playsInline className="hero-video">
  <source src={parisVideo} type="video/mp4" />
  <img src="/fallback.jpg" alt="Travel destination" />
</video>

              <div className="hero-content">
                <h1 className="hero-title">Your Next Adventure Starts Here</h1>
                <p className="hero-subtitle">
                  Personalized travel experiences, crafted just for you.
                </p>
                <button onClick={handleChatRedirect} className="btn-primary">
                  Start Planning Your Trip
                </button>
              </div>
            </div>

            {/* --- How We Help You Travel Section --- */}
            <h2 className="section-title">How We Help You Travel</h2>
            <div className="how-it-works">
              <div className="how-it-works-content">
                <h1 className="main-heading">
                  Your Perfect Travel Experience in 3 Steps
                </h1>
                <p className="paragraph">
                  Pathmakers simplifies your travel planning with personalized recommendations and expert guidance.
                </p>
              </div>
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
                    </svg>
                  </div>
                  <div className="feature-info">
                    <h2 className="feature-title">Tell Us Your Dreams</h2>
                    <p className="feature-description">Share your travel preferences, dates, and budget with our AI assistant.</p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,160V112a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm48,0V112a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0ZM208,48H48A16,16,0,0,0,32,64V72a8,8,0,0,0,16,0V64H208V72a8,8,0,0,0,16,0V64A16,16,0,0,0,208,48Z"/>
                    </svg>
                  </div>
                  <div className="feature-info">
                    <h2 className="feature-title">Receive Tailored Plans</h2>
                    <p className="feature-description">Our AI crafts personalized itineraries based on your input.</p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM188.24,98.24l-56,56a8,8,0,0,1-11.31,0l-24-24a8,8,0,0,1,11.31-11.31L132,138.34l50.34-50.34a8,8,0,0,1,11.31,11.31Z"/>
                    </svg>
                  </div>
                  <div className="feature-info">
                    <h2 className="feature-title">Enjoy Your Journey</h2>
                    <p className="feature-description">Book your trip with confidence and embark on an unforgettable adventure.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Why Choose Pathmakers Section --- */}
            <h2 className="section-title">Why Choose Pathmakers</h2>
            <div className="service-grid">
              <div className="service-item">
                <div className="service-image expert-guidance" />
                <div>
                  <p className="service-title">Expert Guidance</p>
                  <p className="service-description">
                    Get professional travel advice from our experienced team and AI-powered recommendations.
                  </p>
                </div>
              </div>
              <div className="service-item">
                <div className="service-image personalized-experience" />
                <div>
                  <p className="service-title">Personalized Experience</p>
                  <p className="service-description">
                    Every trip is tailored to your unique preferences, interests, and travel style.
                  </p>
                </div>
              </div>
              {/* Added two more service items for a richer layout */}
              <div className="service-item">
                <div className="service-image flexible-booking" />
                <div>
                  <p className="service-title">Flexible Booking</p>
                  <p className="service-description">
                    Enjoy peace of mind with flexible booking options and easy modifications.
                  </p>
                </div>
              </div>
              <div className="service-item">
                <div className="service-image unrivaled-support" />
                <div>
                  <p className="service-title">Unrivaled Support</p>
                  <p className="service-description">
                    Our team is available 24/7 to assist you before, during, and after your trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;