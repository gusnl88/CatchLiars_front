import React, { useState } from "react";
import "./styles/headerStyle.css";
import Timer from "./Timer";
import GameInfo from "./gameInfo";
// import Game from "./Game"; // Game 컴포넌트 import

export default function Header() {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [round, setRound] = useState(1);

    const startGame = () => {
        setGameStarted(true);
    };

    const nextPlayer = () => {
        setCurrentPlayer((prevPlayer) => {
            if (prevPlayer === 6) {
                setRound((prevRound) => prevRound + 1); // Round 증가
                return 1; // 플레이어 다시 1번부터 시작
            } else {
                return prevPlayer + 1;
            }
        });
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
                        <Timer
                            gameStarted={gameStarted}
                            nextPlayer={nextPlayer}
                            currentPlayer={currentPlayer}
                        ></Timer>
                    </div>
                    <div className="gameInfo">
                        <GameInfo
                            startGame={startGame}
                            currentPlayer={currentPlayer}
                            gameStarted={gameStarted}
                            round={round}
                        ></GameInfo>
                    </div>
                    <div className="word">제시어</div>
                </div>
            </nav>
        </header>
    );
}
