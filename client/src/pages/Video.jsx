import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Video.css';
import ph from "../assets/Pathmakers-VEED.mp4"; // Importing video

const VideoExplanation = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/next-page');
    };

    return (
        <div className="containerVideo">
            <div className="videoContainer">
                <video 
                    className="video" 
                    autoPlay  // ✅ Enables autoplay
                 
                    loop      // ✅ Loops the video
                    playsInline // ✅ Ensures it works properly on mobile
                    controls  // ✅ Still allows users to control playback
                >
                    <source src={ph} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="textContainer">
                <h1 className="title">How to Use the Website</h1>
                <p className="description">
                    This video explains how to navigate and use the website efficiently. 
                    Watch the video to understand the features, and learn how to get 
                    the most out of your experience.
                </p>
                <div className="buttonContainer">
                    <button 
                        className="nextButton"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoExplanation;
