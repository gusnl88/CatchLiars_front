import React from "react";
import "./styles/startGameBtn.scss";
const Game = ({ startGame, gameStarted, currentPlayer }) => {
    //   const [gameStarted, setGameStarted] = useState(false);
    //   const [currentPlayer, setCurrentPlayer] = useState(1);

    //   const startGame = () => {
    //     setGameStarted(true);
    //   };

    //   const nextPlayer = () => {
    //     setCurrentPlayer((prevPlayer) => (prevPlayer % 6) + 1); // 6명까지 플레이어 변경
    //   };

    return (
        <>
            {!gameStarted && (
                <button onClick={startGame} className="learn-more">
                    게임 시작
                </button>
            )}
            {gameStarted && (
                <div>
                    <h1>게임</h1>
                    <p>현재 플레이어: {currentPlayer}</p>
                </div>
            )}
        </>
    );
};

export default Game;
