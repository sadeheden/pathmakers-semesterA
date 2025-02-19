import React from 'react';
import '../assets/styles/DownloadApp.css';
import appleImg from '../assets/images/apple.png';
import androidImg from '../assets/images/android.png';

const DownloadApp = () => {
    const handleDownload = (platform) => {
        if (platform === 'ios') {
            window.location.href = 'https://www.apple.com/store'; // קישור לדף החנות של אפל
        } else if (platform === 'android') {
            window.location.href = 'https://play.google.com/store'; // קישור לחנות של אנדרואיד
        }
    };

    return (
        <div className="outerContainer"> {/* This ensures full centering */}
            <div className="containerDow">
                <h1 className="title">Download Our App</h1>
                <p className="description">
                    Get the best experience by downloading our app on your iPhone or Android device.
                    Stay connected and enjoy exclusive features on the go!
                </p>
                
                <div className="buttonsD">
                    <a 
                        href="#"
                        className="button ios"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDownload('ios');
                        }}
                    >
                        <img 
                            src={appleImg} 
                            alt="iOS Logo" 
                            className="buttonIcon"
                        />
                        Download for iPhone
                    </a>
                    
                    <a 
                        href="#"
                        className="button android"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDownload('android');
                        }}
                    >
                        <img 
                            src={androidImg} 
                            alt="Android Logo" 
                            className="buttonIcon"
                        />
                        Download for Android
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DownloadApp;
