import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import axiosUtils from "../../utils/axiosUtils";
import { useSelector } from "react-redux";

const SOCKET_SERVER_URL = "http://localhost:8089";

const RoomContainer = styled.div`
    background-color: white;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    color: black;
    display: flex;
    justify-content: space-around;
    position: relative;

    .side_zone {
        width: 20%;
        height: 100%;

        .side_box {
            display: flex;
            height: 100%;
            flex-direction: column;

            .user_box {
                height: 80%;

                .user_profile {
                    height: 25%;
                    width: 100%;

                    .profile_box {
                        padding: 5px;
                        height: 100%;
                    }
                    img {
                        border-radius: 10px;
                        height: 80%;
                        width: 100%;
                    }
                }
            }

            .event_zone {
                height: 20%;
                display: flex;
                justify-content: center;
                align-items: center;

                .btn_box {
                    button {
                        width: 100px;
                        height: 30px;
                        margin: 5px;
                        border-radius: 5px;
                        border: none;
                        cursor: pointer;
                        background-color: yellow;
                        font-weight: bold;

                        &:hover {
                            background-color: #f0a927;
                        }
                    }
                }
            }
        }
    }

    .play_zone {
        width: 60%;

        .title_box {
            height: 10%;
            display: flex;
            align-items: center;

            h1 {
                margin: 10px auto;
            }
        }

        .ment_box {
            background-color: #80808054;
            height: 30%;
            .img_box {
                height: 90%;
                width: 100%;
            }
        }

        .chat_box {
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: skyblue;
            height: 60%;

            .chat_main {
                border-radius: 10px;
                background-color: white;
                margin: 10px auto;
                width: 95%;
                height: 85%;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                padding: 10px;
                gap: 5px;

                /* 채팅창이 자동으로 맨 아래로 스크롤되도록 */
                scroll-behavior: smooth;
            }

            .chat_main::-webkit-scrollbar {
                width: 8px;
            }

            .chat_main::-webkit-scrollbar-thumb {
                background-color: #d3d3d3;
                border-radius: 4px;
            }

            .chat_main::-webkit-scrollbar-thumb:hover {
                background-color: #a0a0a0;
            }

            .chat_input {
                height: 15%;
                width: 100%;
                align-content: center;
                text-align: center;

                input {
                    width: 85%;
                }

                button {
                    width: 40px;
                    margin-left: 5px;
                    border: none;
                    background-color: yellow;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
        }
    }

    .job_title {
        width: 300px;
        height: 150px;
        background-color: #a0a0a0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        justify-content: center;
        border-radius: 10px;

        span {
            align-content: center;

            .job {
                color: #ff050582;
            }
        }
    }
    .vote_box {
        width: 300px;
        height: 150px;
        background-color: #a0a0a0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        justify-content: center;
        border-radius: 10px;
    }
    .vote_btn {
        display: none;
    }
`;
const MafiaGameRoom = ({ room }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const [isRoomOwner, setIsRoomOwner] = useState(false);
    const [isRoomFull, setIsRoomFull] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [gameTime, setGameTime] = useState(5); // 초 단위로 설정
    const [voteSelect, setVoteSelect] = useState(false);
    const [isDaytime, setIsDaytime] = useState(true);
    const loginUser = useSelector((state) => state.loginReducer.user);
    const chatContainerRef = useRef(null);
    const TitleRef = useRef(null);
    const VoreRef = useRef(null);
    const VoteBtnRef = useRef(null);
    useEffect(() => {
        if (gameTime === 0) {
            VoteBtnRef.current.style.display = "block"; // 투표 버튼을 보이게 설정
        } else if (gameTime < 0) {
            setGameTime(0); // 음수가 되는 것을 방지하기 위해 게임 시간을 0으로 설정
        }
    }, [gameTime]);
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        newSocket.on("message", (data) => {
            console.log(data);
            if (data.type === "message") {
                console.log("진입햇어요");
                setMessages((prevMessages) => [...prevMessages, data.message]);
            } else if (data.type === "notice") {
                TitleRef.current.innerHTML = `<span>${data.message}</span>`;
                TitleRef.current.style.display = "flex";
                setTimeout(() => {
                    TitleRef.current.style.display = "none";
                    TitleRef.current.innerHTML = "";
                }, 3000);
            }
        });

        newSocket.on("userList", (users) => {
            console.log(users);
            setUserList(users);
            setIsRoomOwner(users[0] === loginUser.id);
            setIsRoomFull(users.length >= 1);
        });
        newSocket.on("job", (data) => {
            const { job, mafiaList } = data;
            // console.log('직업소개',job.mafiaList[0])
            // 게임시작  직업을 전달하고
            if (job === "마피아") {
                let mafiaMessage = "";
                setIsGameStarted(true);

                for (let mafia of mafiaList) {
                    mafiaMessage += `${mafia}  `;
                }

                TitleRef.current.innerHTML = `<span>당신은 <span class="job">${job}</span>입니다.</br>마피아는 지금 ${mafiaMessage}입니다</span>`;
                console.log(`당신은 ${job}입니다.`);
                console.log(userList);
                TitleRef.current.style.display = "flex";
                setTimeout(() => {
                    TitleRef.current.style.display = "none";
                    TitleRef.current.innerHTML = "";
                }, 3000);
            } else {
                setIsGameStarted(true);
                console.log(`당신은 ${job}입니다.`);
                console.log(userList);
                TitleRef.current.style.display = "flex";
                TitleRef.current.innerHTML = `<span>당신은 <span class="job">${job}</span>입니다.<br>자유롭게 의견을 나누세요</span>`;
                setTimeout(() => {
                    TitleRef.current.style.display = "none";
                    TitleRef.current.innerHTML = "";
                }, 3000);
            }
        });
        newSocket.on("victory", (data) => {
            setTimeout(() => {
                outBtn();
            }, 10000);
        });
        newSocket.on("restart", (data) => {
            // 게임 다시 시작 처리
            console.log(data.isDaytime ? "마피아시간" : "낮투표시간");
            let message;
            if (data.isDaytime) {
                message = `밤이 되었습니다. 마피아는 의견을 나누고 시민을 투표해 주세요.`;
                setIsDaytime(false);
            } else {
                message = `낮입니다 의견을 자유롭게 나누세요`;
                setIsDaytime(true);
            }
            setMessages((prevMessages) => [...prevMessages, message]);
            if (data.isDaytime) {
                //전 투표가 낮이면(true)마피아 투표 로직

                if (data.maxVote === loginUser.id) {
                    setTimeout(() => {
                        console.log(data.maxVote, "종료합니다");
                        outBtn();
                    }, 3000);
                } else {
                    for (const userId in data.userList) {
                        if (data.mafiaList.includes(loginUser.id)) {
                            console.log("마피아는 현재", data.userList[userId].userId);
                            TitleRef.current.style.display = "flex";
                            TitleRef.current.innerHTML = `마피아는 상의후 제한시간 내에 투표를 진행시켜 주세요.`;
                            setTimeout(() => {
                                TitleRef.current.style.display = "none";
                                TitleRef.current.innerHTML = "";
                            }, 3000);
                            console.log("재시작실행");
                            setGameTime(10);
                            setVoteSelect(false);
                        } else {
                            setGameTime(10);
                        }
                    }
                }
            } else {
                //전 투표가 밤이면(false)시민 투표 로직
                if (data.maxVote === loginUser.id) {
                    setTimeout(() => {
                        console.log(data.maxVote, "종료합니다");
                        outBtn();
                    }, 3000);
                } else {
                    console.log("재시작실행");
                    setGameTime(10);
                    setVoteSelect(false);
                }
            }
        });

        newSocket.emit("joinRoom", { roomId: room.g_seq, userId: loginUser.id });

        const handleKeyDown = (event) => {
            if (event.key === "F5" || ((event.ctrlKey || event.metaKey) && event.key === "r")) {
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("beforeunload", outBtn);

        return () => {
            newSocket.off("message");
            newSocket.off("userList");
            newSocket.off("restart"); // restart 이벤트 리스너 제거
            newSocket.close();
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("beforeunload", outBtn);
            if (!newSocket.connected) {
                axiosUtils.patch(`/games/minus/${room.g_seq}`);
            }
        };
    }, [room, loginUser]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isGameStarted) {
            const interval = setInterval(() => {
                setGameTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isGameStarted]);

    const sendMessage = () => {
        if (socket && message.trim() !== "") {
            socket.emit("message", { roomId: room.g_seq, message });
            setMessage("");
        }
    };

    const outBtn = () => {
        axiosUtils.patch(`/games/minus/${room.g_seq}`);
        if (socket) {
            socket.disconnect();
        }
        window.location.reload();
    };

    const startGame = () => {
        let message = ``;
        if (isDaytime) {
            message = `낮입니다 의견을 자유롭게 나누세요`;
            setMessages((prevMessages) => [...prevMessages, message]);
        }

        if (socket) {
            // 게임 시작
            console.log("시작");
            console.log(room.g_seq, "룸번호");
            socket.emit("startGame", { roomId: room.g_seq, isDaytime: isDaytime });
            setIsGameStarted(true); // 펄스 일때만 시작버튼이 보인다.
        }
    };

    const voteBtn = () => {
        VoreRef.current.style.display = "flex"; // TitleRef를 먼저 표시
    };
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
    const vote = (user) => {
        if (!voteSelect) {
            console.log("투표", user, room.g_seq);
            setVoteSelect(true);
            // 투표 처리 로직 추가
            socket.emit("vote", { userId: user, roomId: room.g_seq, isDaytime });
            VoreRef.current.style.display = "none";
        } else {
            alert("이미투표하셧습니다.");
            VoreRef.current.style.display = "none";
        }
    };
    return (
        <RoomContainer>
            <div className="side_zone">
                <div className="side_box">
                    <div className="user_box">
                        {userList
                            ?.map((item, index) => (
                                <div key={index} className="user_profile">
                                    <div className="profile_box">
                                        <img src="/images/profile.png" alt="" />
                                        <span>게임아이디: {item}</span>
                                        {index === 0 && <span> (방장)</span>}
                                    </div>
                                </div>
                            ))
                            .slice(0, 4)}
                    </div>
                    <div className="event_zone">
                        <div className="btn_box">
                            {isRoomOwner && isRoomFull && !isGameStarted && (
                                <button onClick={startGame}>게임 시작</button>
                            )}
                            <button>초대</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="play_zone">
                <div className="title_box">
                    <h1>{room.g_title}</h1>
                </div>
                <div className="ment_box">
                    <span>
                        게임시간: {formatTime(gameTime)}
                        {isDaytime ? (
                            <img className="img_box" src="/images/daytime.jpg" alt="" />
                        ) : (
                            <img className="img_box" src="/images/night.jpg" alt="" />
                        )}
                    </span>
                    <div ref={TitleRef} className="job_title"></div>
                    <div ref={VoreRef} className="vote_box">
                        {userList.map((item, index) => (
                            <button key={index} onClick={() => vote(item)}>
                                {item} 투표
                            </button>
                        ))}
                    </div>
                </div>
                <div className="chat_box">
                    <div className="chat_main" ref={chatContainerRef}>
                        {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))}
                    </div>
                    <div className="chat_input">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : "")}
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            </div>
            <div className="side_zone">
                <div className="side_box">
                    <div className="user_box">
                        {userList
                            ?.map((item, index) => (
                                <div key={index} className="user_profile">
                                    <div className="profile_box">
                                        <img src="/images/profile.png" alt="" />
                                        <span>게임아이디: {item}</span>
                                        {index === 0 && <span> (방장)</span>}
                                    </div>
                                </div>
                            ))
                            .slice(4, 8)}
                    </div>
                    <div className="event_zone">
                        <div className="btn_box">
                            <button ref={VoteBtnRef} className="vote_btn" onClick={voteBtn}>
                                투표하기
                            </button>
                            <button onClick={outBtn}>나가기</button>
                        </div>
                    </div>
                </div>
            </div>
        </RoomContainer>
    );
};

export default MafiaGameRoom;
