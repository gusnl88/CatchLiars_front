// App.js
import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginUser from "./components/LoginUser";
import GameWaitngList from "./pages/GameWaitingList";
import Mypage from "./pages/Mypage";
import CatchLiarInGame from "./pages/CatchLiarInGame";

import LankingPage from "./pages/LankingPage";
import FriendInvitationPage from "./pages/FriendInvitationPage";
import DmPage from "./pages/DmPage";
import SessionCheck from "./components/main/SessionCheck";
import MafiaGameRoom from "./components/games/MafiaGameRoom";

function App() {
    const loginUser = useSelector((state) => state.loginReducer.user);
    return (
        <>
            {loginUser && <SessionCheck />}
            <Routes>
                <Route path="/" element={LoginUser(loginUser, <MainPage />)} />
                <Route path="/games" element={LoginUser(loginUser, <MainPage />)} />
                <Route
                    path="/games/list/:type"
                    element={LoginUser(loginUser, <GameWaitngList />)}
                />
                <Route
                    path="/games/list/Mafia/:roomId"
                    element={LoginUser(loginUser, <MafiaGameRoom />)}
                />
                <Route path="/users/mypage" element={LoginUser(loginUser, <Mypage />)} />
                <Route
                    path="/games/list/:CatchLiar/Ingame"
                    element={LoginUser(loginUser, <CatchLiarInGame />)}
                />
                <Route path="dms" element={LoginUser(loginUser, <DmPage />)} />

                <Route path="users/lank" element={LoginUser(loginUser, <LankingPage />)} />
                <Route
                    path="users/friends/accept"
                    element={LoginUser(loginUser, <FriendInvitationPage />)}
                ></Route>
            </Routes>
        </>
    );
}

export default App;
