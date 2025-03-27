import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../assets/styles/main.css';

const Main = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleChatRedirect = () => {
    navigate('/chat'); // Redirect to /chat when the button is clicked
  };

  const handleAnotherRedirect = () => {
    navigate('/another'); // Redirect to /another when the second button is clicked
  };

  return (
    <div className="main-container">
      {/* Placeholder for video */}
      <img 
        className="main-video"
        src="https://www.passportcard.co.il/wp-content/uploads/2023/08/Depositphotos_10800421_XL-scaled-1.jpg" 
        alt="Background"
      />
      
      <div className="main-overlay">
        <div className="main-content">
          <h1 className="main-heading">Welcome to Pathmakers</h1>
          <p className="main-description">Travel agency which you'll love</p>
          
          <div className="main-buttons">
            <button className="main-btn" onClick={handleChatRedirect}>
              Chat with the chat
            </button>
            <button className="main-btn" onClick={handleAnotherRedirect}>
              AI consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
