import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/register/Register";
import "./app.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import NotFound from "./pages/notfound/NotFound";
import { currentUser } from "./context/AuthContext";
import Profile from "./pages/profile/Profile";
import Explore from "./pages/explore/Explore";
import Chat from "./pages/chat/Chat";

const App = () => {
  const { user } = useContext(currentUser);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile/:username"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/explore/people"
            element={user ? <Explore /> : <Navigate to="/" />}
          />
          <Route
            path="/messages"
            element={user ? <Chat /> : <Navigate to="/" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
