import "../components/catchgame/styles/headerStyle.css";
import Canvas from "../components/catchgame/Paint";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
// import GameInfo from "../components/catchgame/gameInfo";
import styled from "styled-components";
import "../components/catchgame/styles/startGameBtn.scss";
import Chat from "../components/catchgame/chat";

const TimerStyle = styled.div`
    display: flex;
    background-color: white;
    background-image: url("/images/clock.gif");
    background-size: cover;
    background-repeat: no-repeat;
    width: 3rem;
    height: 3rem;
    justify-content: center;
    align-items: center;
`;

const words = ["사과", "배", "노트북", "컴퓨터", "아이패드", "치킨"];
let liar_idx = 0;

const socket = io.connect(process.env.REACT_APP_API_SERVER, {
    autoConnect: false,
});

function CatchLiarInGame({ room }) {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [round, setRound] = useState(1);
    const [remainTime, setRemainTime] = useState(5);
    const [players, setPlayers] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const loginUser = useSelector((state) => state.loginReducer.user);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTime, setModalTime] = useState(5);

    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };

    const startGame = (e) => {
        e.preventDefault();
        setModalTime(5);
        setModalOpen(true);

        const timer = setInterval(() => {
            setModalTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timer);
                    setModalOpen(false);

                    const max_idx = players.length - 1;
                    liar_idx = Math.floor(Math.random() * (max_idx - 0 + 1)); // 라이어 인덱스 랜덤 추출
                    // 무작위로 단어 2개 추출(첫 번째 단어가 라이어 단어)
                    const randomWords = words.sort(() => 0.5 - Math.random()).slice(0, 2);
                    setKeywords(randomWords);
                    setGameStarted(true);

                    socket.emit("gamestart", true);
                    // socket.emit("modal", { modalOpen, modalTime });

                    return 0;
                }
            });
        }, 1000);
    };

    socket.on("start", (start) => {
        setGameStarted(start);
    });

    useEffect(() => {
        socket.emit("modal", { modalOpen, modalTime });
    }, [modalOpen, modalTime]);

    useEffect(() => {
        socket.on("modal", (data) => {
            setModalOpen(data.modalOpen);
            setModalTime(data.modalTime);
        });
    }, []);

    // useEffect(() => {
    //     if (gameStarted === true)
    //         socket.on("updateGameData", (data) => {
    //             setRemainTime(data.remainTime);
    //             setCurrentPlayer(data.currentPlayer);
    //             setRound(data.round);
    //             setPlayers(data.players);
    //             console.log(">>", data);
    //         });
    //     else {
    //     }
    // }, []);

    useEffect(() => {
        let timer;
        if (gameStarted) {
            timer = setInterval(() => {
                setRemainTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        setCurrentPlayer((prevPlayer) => {
                            if (prevPlayer === players.length) {
                                setRound((prevRound) => {
                                    if (prevRound === 2) {
                                        clearInterval(timer); // 2 라운드가 끝나면 타이머 종료
                                        setGameStarted(false);
                                        return 1;
                                    }
                                    return prevRound + 1; // Round 증가
                                });
                                return 1; // 플레이어 다시 1번부터 시작
                            } else {
                                return prevPlayer + 1;
                            }
                        });
                        return 5;
                    }
                });

                // gameStarted가 true인 경우에만 서버로 게임 데이터를 업데이트합니다.
                socket.emit("updateGameData", {
                    remainTime,
                    currentPlayer,
                    round,
                    players,
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted, setCurrentPlayer, setRound, remainTime, currentPlayer, round, players]);

    // useEffect(() => {
    //     if (currentPlayer === players.length && round === 2) {
    //         // round가 2일 때만 해당 조건 추가
    //         clearInterval(timerID); // 타이머 멈추기
    //     }
    // }, [currentPlayer, round, players.length, timerID]);

    useEffect(() => {
        initSocketConnect();

        socket.on("gameId", (data) => {
            // console.log("socketId", data);
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

            // console.log(">>", players);
        });
    }, [players]);

    return (
        <div style={{ backgroundColor: "white", color: "black", justifyContent: "left" }}>
            <header className="header">
                <nav>
                    {modalOpen && (
                        <div className="modal">
                            {/* 모달 내용 */}
                            <div className="modal-content">
                                <h2>게임이 준비 중입니다...</h2>
                                <br />
                                <h2>{modalTime}초뒤 게임이 시작됩니다</h2>
                            </div>
                        </div>
                    )}
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
                            <div>
                                {!gameStarted && (
                                    <button
                                        onClick={(e) => {
                                            startGame(e);
                                        }}
                                        className="learn-more"
                                    >
                                        게임 시작
                                    </button>
                                )}
                                {gameStarted && (
                                    <div>
                                        <h1>Round {round}</h1>
                                        <br />
                                        <p>
                                            현재 플레이어:
                                            <span style={{ color: "blue" }}>
                                                {players.length > 0 &&
                                                    players[currentPlayer - 1].nickName}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="word">
                            {players[liar_idx] === loginUser ? keywords[0] : keywords[1]}
                        </div>
                    </div>
                </nav>
            </header>
            <div style={{ display: "flex" }}>
                <Canvas
                    style={{ width: "100%", height: "100%", flex: "1" }}
                    players={players}
                    gameStarted={gameStarted}
                    loginUser={loginUser}
                ></Canvas>

                <Chat loginUser={loginUser}></Chat>
            </div>
        </div>
    );
}

export default CatchLiarInGame;
