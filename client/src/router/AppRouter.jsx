import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import PersonalArea from "../pages/PersonalArea";
import Video from "../pages/Video";
import DownloadApp from "../pages/DownloadApp";
import Signup from "../pages/Signup";
import Main from "../pages/Main";

export const Router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/chat", element: <Chat /> },
  { path: "/main", element: <Main /> },
  { path: "/login", element: <Login /> },
  { path: "/personal-area", element: <PersonalArea /> },
  { path: "/video", element: <Video /> },
  { path: "/downloadApp", element: <DownloadApp /> },
  { path: "/signup", element: <Signup /> },
]);
