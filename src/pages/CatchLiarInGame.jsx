import "../components/catchgame/styles/headerStyle.css";
import Canvas from "../components/catchgame/Paint";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import styled from "styled-components";
import "../components/catchgame/styles/startGameBtn.scss";
import Chat from "../components/catchgame/chat";

const Catch = styled.div`
    position: relative;
    /* background-color: white; */
    background-image: url("/images/CatchLiar.gif");
    background-size: cover;
    background-repeat: no-repeat;
    width: 10rem;
    height: 100%;
    justify-content: center;
    align-items: center;
    bottom: 20%;
`;

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
    const [liarIdx, setLiarIdx] = useState(null);
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const [timer, setTimer] = useState(true); // 전체 타이머 상태
    const [timerCount, setTimerCount] = useState(20);
    const [resultModal, setResultModal] = useState(false);
    const [restartBtn, setRestartBtn] = useState(false);
    const [ctx, setCtx] = useState(null);
    const [painting, setPainting] = useState(false);

    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };

    useEffect(() => {
        let interval;
        if (!timer) {
            interval = setInterval(() => {
                setTimerCount((prevCount) => {
                    if (prevCount > 0) {
                        return prevCount - 1;
                    } else {
                        clearInterval(interval);
                        setShowModal(false);
                        setResultModal(true);
                        setRestartBtn(true);
                    }
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer]);

    const startGame = () => {
        if (players.length < 3) {
            alert("3명 이상의 플레이어가 모여야 시작됩니다");
            return;
        }
        setModalTime(5);
        setModalOpen(true);

        const max_idx = players.length - 1;
        const randomLiarIdx = Math.floor(Math.random() * (max_idx - 0 + 1)); // 라이어 인덱스 랜덤 추출
        setLiarIdx(randomLiarIdx);

        const randomWords = words.sort(() => 0.5 - Math.random()).slice(0, 1);
        setKeywords(randomWords);

        socket.emit("wordData", randomWords);

        const timer = setInterval(() => {
            setModalTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timer);
                    setModalOpen(false);
                    setGameStarted(true);
                    socket.emit("gamestart", true, room.g_seq);
                    return 0;
                }
            });
        }, 1000);
    };

    socket.on(
        "start",
        (start) => {
            setGameStarted(start);
        },
        []
    );

    useEffect(() => {
        socket.on("wordData", (data) => {
            setKeywords(data);
        });
    }, []);

    useEffect(() => {
        socket.emit("liarData", liarIdx);
    }, [liarIdx]);

    useEffect(() => {
        socket.on("liarData", (data) => {
            setLiarIdx(data);
        });
    }, []);

    useEffect(() => {
        socket.emit("modal", { modalOpen, modalTime });
    }, [modalOpen, modalTime]);

    useEffect(() => {
        socket.on("modal", (data) => {
            setModalOpen(data.modalOpen);
            setModalTime(data.modalTime);
        });
    }, []);

    useEffect(() => {
        if (gameStarted) {
            // 타이머 시작
            let interval;
            if (gameStarted && remainTime > 0 && currentPlayer <= players.length && round <= 2) {
                interval = setInterval(() => {
                    setRemainTime((prevSeconds) => prevSeconds - 1);
                }, 1000);
            }

            // 0초에 도달하면 라운드 종료
            if (remainTime === 0) {
                setRemainTime(5); // 초 초기화
                setCurrentPlayer((prevIndex) => prevIndex + 1); // 다음 플레이어 인덱스로 이동
                if (currentPlayer === players.length) {
                    if (round === 2) {
                        clearInterval(interval); // 타이머 종료
                        setTimer(false);
                        setGameStarted(false);
                        socket.emit("gamestart", false, room.g_seq);
                    } else {
                        setRound((prevRound) => prevRound + 1); // 라운드 증가
                        setCurrentPlayer(1); // 플레이어 인덱스 초기화
                    }
                }
            }

            socket.emit("updateGameData", {
                remainTime,
                currentPlayer,
                round,
                players,
                timer,
            });

            return () => {
                clearInterval(interval);
            };
        }
    }, [
        gameStarted,
        setCurrentPlayer,
        setRound,
        remainTime,
        currentPlayer,
        round,
        players,
        timer,
        loginUser,
    ]);

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
        });
    }, [players]);

    // if (liarIdx) console.log("라이어", players[liarIdx].nickName);
    // console.log("키워드", keywords[0]);

    return (
        <div style={{ backgroundColor: "white", color: "black" }}>
            <header className="header">
                <nav>
                    <div className="bar">
                        <div className="logo">
                            <Catch></Catch>
                        </div>
                        <div className="roomName">{room.g_title}</div>
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
                                {!gameStarted &&
                                players.length > 0 &&
                                players[0].id === loginUser.id ? (
                                    <button onClick={startGame} className="learn-more">
                                        게임 시작
                                    </button>
                                ) : null}
                                {gameStarted && (
                                    <div>
                                        <h1>Round {round}</h1>
                                        <br />
                                        <p>
                                            현재 플레이어:
                                            <span style={{ color: "blue" }}>
                                                {players.length > 0
                                                    ? players[currentPlayer - 1]?.nickName
                                                    : null}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="word">
                            <h1>
                                {gameStarted
                                    ? players[liarIdx]?.id === loginUser?.id
                                        ? `글자수는 ${keywords[0]?.length} 글자 입니다.`
                                        : keywords[0]
                                    : "제시어"}
                            </h1>
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
                    room={room}
                    timer={timer}
                    ctx={ctx}
                    setCtx={setCtx}
                    painting={painting}
                    setPainting={setPainting}
                ></Canvas>

                <Chat
                    loginUser={loginUser}
                    gameStarted={gameStarted}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    timer={timer}
                    timerCount={timerCount}
                    resultModal={resultModal}
                    setResultModal={setResultModal}
                    setGameStarted={setGameStarted}
                    restartBtn={restartBtn}
                    setRestartBtn={setRestartBtn}
                    liarIdx={liarIdx}
                    players={players}
                    ctx={ctx}
                    setCtx={setCtx}
                    painting={painting}
                    setPainting={setPainting}
                    round={round}
                    setRound={setRound}
                    setTimerCount={setTimerCount}
                    setCurrentPlayer={setCurrentPlayer}
                    currentPlayer={currentPlayer}
                ></Chat>
            </div>

            {modalOpen && (
                <div className="modal">
                    {/* 모달 내용 */}
                    <div className="modal-content">
                        {players[liarIdx]?.id === loginUser.id ? (
                            <div>
                                <h2>
                                    당신은 <span style={{ color: "red" }}>라이어</span> 입니다!
                                </h2>
                                <h2>라이어에게는 제시어가 공개되지 않습니다</h2>
                                <h2>주어진 힌트를 참고하여 정체를 들키지 마세요!</h2>
                            </div>
                        ) : (
                            <h2>게임이 준비 중입니다...</h2>
                        )}

                        <br />
                        <h2>{modalTime}초뒤 게임이 시작됩니다</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CatchLiarInGame;
