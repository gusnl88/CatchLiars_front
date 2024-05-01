import "../components/catchgame/styles/headerStyle.css";
import Canvas from "../components/catchgame/Paint";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import GameInfo from "../components/catchgame/gameInfo";
import styled from "styled-components";

const TimerStyle = styled.div`
    display: flex;
    background-image: url("/images/clock.gif");
    background-size: cover;
    background-repeat: no-repeat;
    width: 3rem;
    height: 3rem;
    justify-content: center;
    align-items: center;
`;

const socket = io.connect("http://localhost:8089", {
    autoConnect: false,
});

function CatchLiarInGame() {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [round, setRound] = useState(1);
    const [remainTime, setRemainTime] = useState(5);
    const [players, setPlayers] = useState([]);
    const loginUser = useSelector((state) => state.loginReducer.user);

    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };

    const nextPlayer = () => {
        setCurrentPlayer((prevPlayer) => {
            if (prevPlayer === players.length) {
                setRound((prevRound) => prevRound + 1); // Round 증가
                return 1; // 플레이어 다시 1번부터 시작
            } else {
                return prevPlayer + 1;
            }
        });
    };

    const startGame = () => {
        setGameStarted(true);
    };

    useEffect(() => {
        let timer;
        if (gameStarted) {
            timer = setInterval(() => {
                setRemainTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timer);
                        nextPlayer(); // 다음 플레이어로 이동
                        return 5;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted, nextPlayer]);

    useEffect(() => {
        if (currentPlayer === 6) {
            // currentPlayer가 6이 되면서 한 번만 실행됨
            setRemainTime(5); // remainTime 초기화
        }
    }, [currentPlayer]);

    useEffect(() => {
        initSocketConnect();

        socket.on("gameId", (data) => {
            console.log("socketId", data);
        });

        socket.emit("loginUser", loginUser);

        // socket.on("userError", (msg) => {
        //     alert(msg);
        // });

        socket.on("errorMsg", (msg) => {
            alert(msg);
        });
        socket.on("updateUserId", (players) => {
            setPlayers(players);

            console.log(">>", players);
        });
    }, [players]);

    return (
        <div>
            <header className="header">
                <nav>
                    <div className="bar">
                        <div className="roomName">방이름</div>
                        <div className="setting">설정</div>
                    </div>
                    <div className="bar">
                        <div className="timer">
                            <TimerStyle>
                                <p>{remainTime}</p>
                            </TimerStyle>
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
            <div style={{ display: "flex" }}>
                <Canvas players={players} gameStarted={gameStarted}></Canvas>
                {/* <Chatting3></Chatting3> */}
            </div>
        </div>
    );
}

export default CatchLiarInGame;
