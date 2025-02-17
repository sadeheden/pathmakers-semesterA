import { router } from './routes/routes';
import { createBrowserRouter } from "react-router-dom";

// Import all page components
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import PersonalArea from "../pages/PersonalArea";
import Video from "../pages/Video";
import DownloadApp from "../pages/DownloadApp";
import Signup from "../pages/Signup";
import Main from "../pages/Main";
import NotFound from "../pages/NotFound"; // Custom 404 Page

// Import the layout components
import Layout from "../components/Layout"; // Wraps pages with Header/Footer

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wraps routes inside Header & Footer
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/chat", element: <Chat /> },
      { path: "/main", element: <Main /> },
      { path: "/login", element: <Login /> },
      { path: "/personal-area", element: <PersonalArea /> },
      { path: "/video", element: <Video /> },
      { path: "/downloadApp", element: <DownloadApp /> },
      { path: "/signup", element: <Signup /> },
      { path: "*", element: <NotFound /> }, // Handles unmatched routes
    ],
  },
]);
