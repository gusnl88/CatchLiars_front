import React from "react";
import "./styles/headerStyle.css";
import Timer from "./Timer";
import GameInfo from "./gameInfo";
import { useState } from "react";

export default function Header() {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(1);

    const startGame = () => {
        setGameStarted(true);
    };

    const nextPlayer = () => {
        setCurrentPlayer((prevPlayer) => (prevPlayer % 6) + 1); // 6명까지 플레이어 변경
    };

    return (
        <header className="header">
            <nav>
                <div className="bar">
                    <div className="roomName">방이름</div>
                    <div className="setting">설정</div>
                </div>
                <div className="bar">
                    <div className="timer">
                        <Timer gameStarted={gameStarted} nextPlayer={nextPlayer}></Timer>
                    </div>
                    <div className="gameInfo">
                        <GameInfo
                            startGame={startGame}
                            currentPlayer={currentPlayer}
                            gameStarted={gameStarted}
                        ></GameInfo>
                    </div>
                    <div className="word">제시어</div>
                </div>
            </nav>
        </header>
    );
}
