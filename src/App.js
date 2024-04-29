// App.js
import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginUser from "./components/LoginUser";
import GameWaitngList from "./pages/GameWaitingList";
import Mypage from "./pages/Mypage";
import CatchLiarInGame from "./pages/CatchLiarInGame";

function App() {
    const loginUser = useSelector((state) => state.loginReducer.user);
    console.log(loginUser);
    return (
        <Routes>
            <Route path="/" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/games" element={LoginUser(loginUser, <MainPage />)} />
            <Route path="/games/list/:type" element={LoginUser(loginUser, <GameWaitngList />)} />
            <Route path="/users/mypage" element={LoginUser(loginUser, <Mypage />)} />
            <Route
                path="/games/list/:CatchLiar/Ingame"
                element={LoginUser(loginUser, <CatchLiarInGame />)}
            />
        </Routes>
    );
}

export default App;
