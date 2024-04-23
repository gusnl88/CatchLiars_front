// App.js
import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginUser from "./components/LoginUser";

function App() {
    const loginUser = useSelector((state) => state.loginReducer.user);
    return (
        <Routes>
            {/* isAuthenticated-사용자가 인증되었으면 true ,아니면 false */}
            <Route path="/" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/login/signin" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/games" element={LoginUser(loginUser, <MainPage />)} />
        </Routes>
    );
}

export default App;
