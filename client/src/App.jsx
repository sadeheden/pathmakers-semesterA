import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import PersonalArea from "./pages/PersonalArea";
import Chat from "./pages/Chat";
import DownloadApp from "./pages/DownloadApp";
import Video from "./pages/Video";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
function App() {
  return (
    <Router>
      <Header />  {/* Header component */}
      
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/personal-area" element={<PersonalArea />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/downloadApp" element={<DownloadApp />} />
          <Route path="/video" element={<Video />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </div>

      <Footer />  {/* Footer component */}
    </Router>
  );
}

// Global styles to ensure layout fits
const styles = {
  content: {
    padding: "20px",
    textAlign: "center",
  },
};

export default App;
