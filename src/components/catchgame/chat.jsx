import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Notice from "./Notice";
import "./styles/chat.css";
import "./styles/voteBtn.scss";
import left from "./images/pang2.png";
import right from "./images/pang.png";

const socket = io.connect("http://localhost:8089", {
    autoConnect: false,
});

export default function Chat({
    loginUser,
    gameStarted,
    showModal,
    setShowModal,
    timer,
    timerCount,
    resultModal,
    setResultModal,
    setGameStarted,
    restartBtn,
    setRestartBtn,
    liarIdx,
    players,
    ctx,
    setCtx,
    painting,
    setPainting,
    setRound,
    setTimerCount,
    setCurrentPlayer,
    round,
    currentPlayer,
    room,
}) {
    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };
    // State 설정
    const [msgInput, setMsgInput] = useState(""); // 메시지 입력 상태
    const [chatList, setChatList] = useState([]); // 채팅 목록 상태
    const [userList, setUserList] = useState({}); // 사용자 목록 상태
    const [userVotes, setUserVotes] = useState({}); // 사용자별 투표 수 상태
    const [hasVoted, setHasVoted] = useState(false);
    const [modalResult, setModalResult] = useState(false);
    const [winner, setWinner] = useState("");
    // const [maxUser, setMaxUser] = useState("");

    useEffect(() => {
        initSocketConnect();
        socket.emit("info", loginUser);
        // notice
        socket.on("notice1", (notice) => {
            setChatList((prevChatList) => [...prevChatList, { type: "notice", content: notice }]);
        });

        //message
        socket.on("message0", (data) => {
            const { nick, message } = data;
            const type = loginUser && loginUser.nickName === data.nick ? "me" : "other";
            const content = message;

            setChatList((prevChatList) => [...prevChatList, { type, content, nick }]);
        });

        socket.on("updateNickname", (nickInfo) => {
            setUserList(nickInfo);
        });

        socket.on("ctx", (data) => {
            setCtx(data);
        });

        socket.on("round", (data) => {
            setRound(data);
        });

        socket.on("current", (data) => {
            setCurrentPlayer(data);
        });

        socket.on("voteUpdate", (votedUser) => {
            setUserVotes((prevUserVotes) => ({
                ...prevUserVotes,
                [votedUser]: (prevUserVotes[votedUser] || 0) + 1,
            }));
            // socket.emit("voteUpdate", userVotes);
        });

        // 컴포넌트 언마운트 시 소켓 연결 해제
        // return () => {
        //     socket.disconnect();
        // };
    }, [loginUser, setCtx, setCurrentPlayer, setRound]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (msgInput.trim() === "") return;

        // 메시지 전송
        const sendData = {
            nick: loginUser.nickName,
            msg: msgInput,
        };
        socket.emit("sendMsg", sendData);

        // 채팅 목록 상태 업데이트
        const newChat = {
            type: "me",
            content: msgInput,
            name: loginUser.id,
        };
        setChatList((prevChatList) => [...prevChatList, newChat]);

        // 메시지 입력 상태 초기화
        setMsgInput("");
    };

    // 사용자 목록을 위한 옵션 요소 생성

    // 스크롤을 자동으로 아래로 이동하기 위한 Ref 설정
    const scrollDiv = useRef(null);
    useEffect(() => {
        scrollDiv.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatList]);

    const handleVoteClick = () => {
        setShowModal(true);
    };

    const restart = () => {
        setGameStarted(false);

        setRestartBtn(false);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 850, 458);
        setTimerCount(20);
        setRound(1);
        setCurrentPlayer(1);
        socket.emit("ctx", ctx);
        socket.emit("round", round);
        socket.emit("current", currentPlayer);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalResult(false);
        setWinner("");
    };

    const handleVote = (votedUser) => {
        // 이미 투표한 경우 처리
        if (hasVoted) {
            console.log("이미 투표하셨습니다.");
            return;
        }

        // 투표처리
        console.log(`${votedUser}에게 투표하셨습니다.`);

        socket.emit("CatchVote", votedUser);

        // 투표 처리 후 상태 업데이트
        setHasVoted(true);
    };

    const checkWinner = () => {
        const voteCounts = Object.values(userVotes);
        const maxVotes = Math.max(...voteCounts);
        const maxVoteUser = Object.keys(userVotes).filter((user) => userVotes[user] === maxVotes);
        console.log("maxVoteUser:", maxVoteUser);
        // setMaxUser(maxVoteUser);
        setModalResult(true);
        setGameStarted(false);
        socket.emit("gamestart", false, room.g_seq);

        if (maxVoteUser.includes(players[liarIdx].nickName) && maxVoteUser.length === 1) {
            console.log("라이어가 패배했습니다!");
            // 라이어 패배
            socket.emit("winner", { result: "시민", isWinner: true });
        } else if (maxVoteUser.length > 1) {
            console.log("무승부입니다!");
            setWinner("무승부");
            // 무승부
            socket.emit("winner", { result: "무승부", isWinner: false });
        } else {
            console.log("시민이 패배했습니다!");
            // 시민 패배
            socket.emit("winner", { result: "라이어", isWinner: false });
        }
    };

    useEffect(() => {
        socket.on("winner", (data) => {
            console.log("게임 결과:", data.result);
            setWinner(data.result);
        });
    }, []);

    useEffect(() => {
        if (!timer) {
            setShowModal(true);
            setPainting(false);
        }
    }, [timer, setShowModal, setPainting]);

    useEffect(() => {
        if (resultModal) {
            checkWinner();
        }
    }, [resultModal]);

    // console.log("1>>>>>>", maxUser.includes(loginUser.nickName));
    // if (liarIdx) console.log("2>>>>>:", maxUser.includes(players[liarIdx].nickName));
    // console.log("유저리스트", Object.values(userList)?.length);
    // console.log("userVotes", userVotes);

    return (
        <div className="container">
            <header>CatchLiar🐛</header>

            <section>
                {/* 채팅 목록 출력 */}
                {chatList.map((chat, i) =>
                    chat.type === "notice" ? (
                        <Notice key={i} chat={chat} />
                    ) : (
                        <div
                            key={i}
                            chat={chat}
                            className={`speech ${chat.type}${chat.isDm ? "dm" : ""}`}
                        >
                            {chat.type === "other" && <span className="nickname">{chat.nick}</span>}
                            <span className="msg-box">{chat.content}</span>
                        </div>
                    )
                )}
                <div ref={scrollDiv}></div>
            </section>
            {/* 메시지 입력 폼 */}
            <form
                className="msg-form"
                id="msg-form"
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
            >
                <input
                    type="text"
                    placeholder="메세지 입력"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                />
                <button>전송</button>
            </form>
            {gameStarted ? (
                !restartBtn ? (
                    <button className="vote" onClick={handleVoteClick}>
                        투표하기
                    </button>
                ) : (
                    <button className="vote" onClick={restart}>
                        재시작
                    </button>
                )
            ) : null}
            {/* 결과 모달창 */}
            {modalResult && (
                <div className="modal">
                    <div
                        className="modal-content"
                        style={{
                            width: "500px",
                            height: "200px",
                            textAlign: "center",
                        }}
                    >
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <img
                                    src={left}
                                    alt=""
                                    style={{ width: "100px", height: "100px" }}
                                />
                                <img
                                    src={right}
                                    alt=""
                                    style={{ width: "100px", height: "100px" }}
                                />
                            </div>
                            {winner === "라이어" ? (
                                <h1>라이어가 승리했습니다!</h1>
                            ) : winner === "무승부" ? (
                                <h1>무승부 입니다!</h1>
                            ) : (
                                <h1>시민팀이 승리했습니다!</h1>
                            )}
                        </div>

                        <br />
                    </div>
                </div>
            )}

            {/* 모달창 */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content" style={{ width: "400px" }}>
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        {!timer && <h2>{timerCount}초후 게임이 종료됩니다...</h2>}
                        <h2>투표 대상 선택</h2>
                        <br />
                        <div className="user-list">
                            <div className="grid-container">
                                {Object.values(userList).map((user, index) => (
                                    <div key={index} className="grid-item">
                                        <button onClick={() => handleVote(user)}>
                                            {user}{" "}
                                            <span className="vote-count">
                                                - {userVotes[user] || 0}표
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
