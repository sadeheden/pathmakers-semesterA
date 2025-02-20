import React from 'react';
import '../assets/styles/AboutPage.css';  // Import the CSS file

const AboutPage = () => {
  return (
    <main className="about-container">
      <h1>Who Are We? 🌟</h1>
      <p>
        We are a team of <span className="highlight">creative</span> 🎨 and <span className="highlight">innovative</span> 💡 individuals 
        dedicated to providing <span className="bold-text">smart</span> and <span className="bold-text">advanced solutions</span> 🚀 
        to every challenge.
      </p>
      <p>
        Our platform offers everything you need to plan your trip ✈️🏨, 
        including <span className="highlight">attractions</span>, <span className="highlight">flights</span>, and <span className="highlight">hotels</span>. 
        We focus on <span className="bold-text">cutting-edge technology</span>, <span className="bold-text">stunning design</span>, 
        and <span className="bold-text">top-notch customer service</span> to ensure a seamless experience.
      </p>
      <p>
        🌟 <span className="important">Committed to enhancing the user experience</span> and offering personalized services 
        tailored to each client. Join us on a journey of <span className="highlight">innovation</span>, <span className="highlight">creativity</span>, 
        and <span className="highlight">professionalism</span>. 
      </p>
      <p>
        ✨ <span className="special-text">Book your next adventure with us—we’re the best at what we do!</span> 🚀💙
      </p>
    </main>
  );
};

export default AboutPage;
