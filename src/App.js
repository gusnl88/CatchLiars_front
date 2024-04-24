// App.js
import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginUser from "./components/LoginUser";
import GameWaitngList from "./pages/GameWaitingList";
import Mypage from "./pages/Mypage";

function App() {
    const loginUser = useSelector((state) => state.loginReducer.user);
    return (
        <Routes>
            <Route path="/" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/login/signin" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/games" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/games/list/:type" element={LoginUser(loginUser, <GameWaitngList />)} />
            <Route path="/users/mypage" element={LoginUser(loginUser, <Mypage />)} />
        </Routes>
    );
}

export default App;
