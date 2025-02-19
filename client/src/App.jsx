import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PersonalArea from "./pages/PersonalArea";
import Chat from "./pages/Chat";
import DownloadApp from "./pages/DownloadApp";
import Video from "./pages/Video";
import AuthForm from "./pages/AuthForm"; // ✅ Use AuthForm for both login & signup
import Main from "./pages/Main";

function App() {
  return (
    <Router>
      <Header />  {/* Header component */}
      
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<AuthForm isLogin={true} />} />  {/* ✅ Fix here */}
          <Route path="/signup" element={<AuthForm isLogin={false} />} /> {/* ✅ Add signup route */}
          <Route path="/personalaArea" element={<PersonalArea />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/downloadApp" element={<DownloadApp />} />
          <Route path="/video" element={<Video />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </div>

      <Footer />  {/* Footer component */}
    </Router>
  );
}

export default App;
