import React from "react";
import "./styles/startGameBtn.scss";
// import GameUser from "./GameUser";
// import Players from "./Players";

const GameInfo = ({ startGame, gameStarted, currentPlayer, round }) => {
    // const Players = Players(loginUser);

    return (
        <>
            {!gameStarted && (
                <button onClick={startGame} className="learn-more">
                    게임 시작
                </button>
            )}
            {gameStarted && (
                <div>
                    <h1>Round {round}</h1>
                    <p>현재 플레이어: {currentPlayer}</p>
                    {/* <GameUser /> */}
                </div>
            )}
        </>
    );
};

export default GameInfo;
