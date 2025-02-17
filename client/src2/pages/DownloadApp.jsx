import React from 'react';
import '../components/DownloadApp.css';

const DownloadApp = () => {
    const handleDownload = (platform) => {
        console.log(`Downloading for ${platform}`);
    };

    return (
        <div className="outerContainer"> {/* This ensures full centering */}
            <div className="containerDow">
                <h1 className="title">Download Our App</h1>
                <p className="description">
                    Get the best experience by downloading our app on your iPhone or Android device.
                    Stay connected and enjoy exclusive features on the go!
                </p>
                
                <div className="buttons">
                    <a 
                        href="#" 
                        className="button ios"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDownload('ios');
                        }}
                    >
                        <img 
                            src="https://www.gett.com/il/wp-content/uploads/sites/5/2023/02/app-download-il.png"
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
                            src="https://images.gringo.co.il/texts/707/mainimage/900x500_abz8bwawkoh8cbx6qvn2.jpg"
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
