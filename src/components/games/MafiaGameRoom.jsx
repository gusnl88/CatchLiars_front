import React, { useState, useEffect, useRef, useMemo } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import axiosUtils from "../../utils/axiosUtils";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const SOCKET_SERVER_URL = process.env.REACT_APP_API_SERVER;

const RoomContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 85%;
    background-color: #00154b;
    background-size: cover;
    background-position: center;
    color: white;
    box-sizing: border-box;
    .main_container {
        background-color: white;
        border-radius: 10px;
        width: 90%;
        height: 90%;
        color: black;
        display: flex;
        position: relative;
    }

    .side_zone {
        width: 20%;
        height: 100%;

        .side_box {
            display: flex;
            flex-direction: column;
            height: 100%;

            .user_box {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 3px;
                .user_profile {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    background-color: #cac9c9;
                    margin: 3px;
                    .game_img {
                        width: 100%;
                        img {
                            width: 100%;
                            height: 58px;
                            border-radius: 10px;
                        }
                    }
                    .profile_box {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;

                        span {
                            margin-left: 5px;
                        }
                        img {
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                        }
                    }
                }
            }

            .event_zone {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 20%;

                .btn_box {
                    display: flex;
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
        display: flex;
        flex-direction: column;

        .title_box {
            height: 50px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-bottom: 1px solid #ccc;
            justify-content: space-around;
            h1 {
                margin: 0;
            }
        }

        .ment_box {
            flex: 1;
            position: relative;
            background-color: #80808054;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 10px; /* 테두리를 둥글게 설정 */

            .img_box {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 10px; /* 테두리를 둥글게 설정 */
            }

            .overlay {
                position: absolute;
                font-size: 20px;
                color: #fff;
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
        max-height: 150px; /* 최대 높이 지정 */
        overflow-y: auto; /* 내용이 넘칠 때 스크롤 표시 */
        background-color: #a0a0a0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        text-align: center;
        padding: 10px;
    }

    .vote_box button {
        width: 80px; /* 버튼 너비를 줄입니다. */
        height: 30px; /* 버튼 높이를 줄입니다. */
        margin: 5px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: #f0a927;
        font-weight: bold;
    }

    .vote_box button:hover {
        background-color: #d9d8d8;
    }

    .vote_btn {
        display: none;
    }
    .dm {
        color: #e12a0e;
    }
    .notice {
        color: green;
    }
    .invitation {
        width: 300px;
        height: 400px;
        background: #808080b5;
        position: absolute;
        top: 10%;
        left: 35%;
        border-radius: 10px;
        z-index: 1;
        display: none;
        overflow-y: scroll;
        .friend_box {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .close_btn {
            display: flex;
            justify-content: end;
            font-size: 20px;
            padding: 10px;
            cursor: pointer;
            a:hover {
                background-color: white;
            }
        }
    }
    @media (max-width: 768px) {
        .side_zone {
            font-size: 10px;
            .btn_box {
                flex-direction: column;
            }
            .btn_box button {
                width: 50px !important;
            }
        }
        .chat_main {
            font-size: 10px;
        }
        .chat_input {
            button {
                display: none;
            }
        }
        .title_box {
            h1 {
                font-size: 10px;
            }
            span {
                font-size: 8px;
                padding: 0;
            }
        }
        .user_profile {
            width: 100%;
            height: 25%;
            .profile_box {
                flex-direction: column;
                .img {
                    width: 30px;
                    height: 30px;
                }
            }
        }
        .game_img {
            display: none;
        }
        .play_zone {
            .job_title {
                width: 180px;
            }
            .chat_main {
                padding: 5px !important;
            }
        }
        .event_zone {
            .invitation {
                width: 160px;
                height: 320px;
                left: 25%;
            }
        }
    }
`;
const MafiaGameRoom = ({ room }) => {
    room = useParams();
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
    const [dmTo, setDmTo] = useState("all");
    const [mafiaList, setMafiaList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const loginUser = useSelector((state) => state.loginReducer.user);
    const chatContainerRef = useRef(null);
    const TitleRef = useRef(null);
    const VoreRef = useRef(null);
    const VoteBtnRef = useRef(null);
    const InvitaionBox = useRef(null);
    const navigater = useNavigate();
    useEffect(() => {
        if (gameTime === 0) {
            VoteBtnRef.current.style.display = "block"; // 투표 버튼을 보이게 설정
        } else if (gameTime < 0) {
            setGameTime(0); // 음수가 되는 것을 방지하기 위해 게임 시간을 0으로 설정
        } else if (gameTime > 0) {
            VoteBtnRef.current.style.display = "none"; // 투표 버튼을 보이게 설정
        }
    }, [gameTime]);
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        newSocket.on("message", (data) => {
            console.log(data);
            if (data.type === "message") {
                const newMessage = {
                    message: data.message,
                    isDm: data.dm,
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
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
            setUserList([...users]); // 배열을 복사해서 업데이트
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
                setMafiaList(mafiaList);
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
        newSocket.on("victory", async (userIdList, victoryList, winner) => {
            setIsGameStarted(false); // 게임 종료
            setIsDaytime(true); // 낮으로 초기화
            setMafiaList([]); // 마피아 리스트 초기화
            // 여기에 남은 유저들의 상태 초기화 로직 추가
            setUserList([...userIdList]);
            setIsRoomOwner(userIdList[0] === loginUser.id);
            setIsRoomFull(userIdList.length >= 1);
            setVoteSelect(false);

            if (winner === "mafia") {
                console.log("마피아승리");
                for (let user of victoryList) {
                    if (user === loginUser.id) {
                        const res = await axiosUtils.patch("/users/score", {
                            u_seq: loginUser.u_seq,
                        });
                        if (res) {
                            alert("마피아가 승리하셧습니다!!!. 스코어점수가 올라갑니다.");
                        }
                    }
                }
                // 마피아가 이겼을 때의 로직
                // 여기에 마피아가 이겼을 때의 추가적인 처리 로직을 작성하세요.
            } else {
                for (let user of victoryList) {
                    if (user === loginUser.id) {
                        const res = await axiosUtils.patch("/users/score", {
                            u_seq: loginUser.u_seq,
                        });
                        if (res) {
                            alert("시민이 승리하셧습니다!!. 스코어점수가 올라갑니다.");
                        }
                    }
                }
            }

            // setTimeout(() => {
            //     outBtn();
            // }, 10000);
        });
        newSocket.on("restart", (data) => {
            // 게임 다시 시작 처리
            console.log(data.isDaytime ? "마피아시간" : "낮투표시간");
            let message;
            let newMessage = {};
            if (data.isDaytime) {
                message = `밤이 되었습니다. 마피아는 의견을 나누고 시민을 투표해 주세요.시민은 투표할수 없습니다.`;
                newMessage = {
                    message: message,
                    isDm: data.dm,
                };
                setIsDaytime(false);
            } else {
                message = `낮입니다 의견을 자유롭게 나누세요`;
                newMessage = {
                    message: message,
                    isDm: data.dm,
                };
                setIsDaytime(true);
            }
            setMessages((prevMessages) => [...prevMessages, newMessage]);
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

        newSocket.emit("joinRoom", { roomId: room, userId: loginUser.id });

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
                axiosUtils.patch(`/games/minus/${room}`);
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
            const sendData = {
                roomId: room,
                dm: dmTo, //all or socket.id
                msg: message,
            };
            socket.emit("message", sendData);
            setMessage("");
        }
    };

    const outBtn = () => {
        //직접 나갈시
        axiosUtils.patch(`/games/minus/${room}`);
        if (socket) {
            socket.disconnect();
        }
        navigater(-1);
    };
    const vitctory = () => {
        console.log(loginUser.u_seq);
        axiosUtils.patch(`/games/minus/${room}`);
        if (socket) {
            socket.disconnect();
        }
        window.location.reload();
    };
    const startGame = () => {
        if (socket) {
            // 게임 시작
            console.log("시작");
            console.log(room, "룸번호");
            socket.emit("startGame", { roomId: room, isDaytime: isDaytime });
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
            console.log("투표", user, room);
            setVoteSelect(true);
            // 투표 처리 로직 추가
            socket.emit("vote", { userId: user, roomId: room, isDaytime });
            VoreRef.current.style.display = "none";
        } else {
            alert("투표를 할 수 없습니다..");
            VoreRef.current.style.display = "none";
        }
    };
    const userOptions = useMemo(() => {
        const options = [];
        for (let key in userList) {
            if (userList[key] != loginUser.id) {
                options.push(
                    <option key={key} value={userList[key]}>
                        {userList[key]}
                    </option>
                );
            }
        }
        return options;
    }, [userList]);

    const inviBtn = async () => {
        const res = await axiosUtils.get("/friends");
        const connectedFriends = res.data.filter((friend) => friend.connect === true);
        console.log(connectedFriends);

        setFriendList(connectedFriends);
        InvitaionBox.current.style.display = "block";
    };
    const inviOutBtn = () => {
        InvitaionBox.current.style.display = "none";
    };
    const invitationBtn = async (u_seq) => {
        console.log(u_seq);
        const data = {
            u_seq: u_seq,
            type: 1,
            g_seq: room,
        };

        try {
            const res = await axiosUtils.post("/invites", data);
            console.log(res.data, "현재데이터는???");
            if (res.data === true) {
                alert("초대하였습니다");
            }
        } catch (error) {
            console.error("초대 요청 실패:", error);
            alert("초대 요청 실패");
        }
    };

    return (
        <RoomContainer>
            <div className="main_container">
                <div className="side_zone">
                    <div className="side_box">
                        <div className="user_box">
                            {userList
                                ?.map((item, index) => (
                                    <div key={index} className="user_profile">
                                        <div className="game_img">
                                            <img src="/images/profile.png" alt="" />
                                        </div>
                                        <div className="profile_box">
                                            <img src="/images/profile.png" alt="" />
                                            <span>
                                                <p>
                                                    게임아이디: {item}
                                                    {index === 0 && <span> (방장)</span>}
                                                </p>
                                            </span>
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
                                <button onClick={() => inviBtn()}>초대</button>
                                <div ref={InvitaionBox} className="invitation">
                                    <div className="close_btn">
                                        <a onClick={inviOutBtn}>x</a>
                                    </div>
                                    <span>접속중이 유저</span>
                                    {friendList.map((item, index) => (
                                        <div key={index} className="friend_box">
                                            <span>{item.id}</span>
                                            <button onClick={() => invitationBtn(item.u_seq)}>
                                                초대
                                            </button>
                                        </div>
                                    ))}
                                    {/* <div className="friend_box">
                                    <span>친구아이디</span>
                                    <button>초대</button>
                                    </div>
                                    <div className="friend_box">
                                    <span>친구아이디</span>
                                    <button>초대</button>
                                    </div>
                                    <div className="friend_box">
                                    <span>친구아이디</span>
                                    <button>초대</button>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="play_zone">
                    <div className="title_box">
                        <h1>마피아게임방!!</h1>
                        {mafiaList.includes(loginUser.id) && (
                            <span>마피아는: {mafiaList.join(", ")}</span>
                        )}{" "}
                    </div>
                    <div className="ment_box">
                        <span>
                            게임시간: {formatTime(gameTime)}
                            {isDaytime ? (
                                <img className="img_box" src="/images/daytime.gif" alt="" />
                            ) : (
                                <img className="img_box" src="/images/night.gif" alt="" />
                            )}
                        </span>
                        <div className="overlay">게임시간: {formatTime(gameTime)}</div>
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
                                <div
                                    key={index}
                                    className={
                                        msg.isDm === "dm"
                                            ? "dm"
                                            : msg.isDm === "notice"
                                            ? "notice"
                                            : ""
                                    }
                                >
                                    {msg.message ? msg.message : msg}
                                </div>
                            ))}
                        </div>
                        <div className="chat_input">
                            <select
                                id="dm-select"
                                value={dmTo}
                                onChange={(e) => setDmTo(e.target.value)}
                            >
                                <option value="all">전체</option>
                                {userOptions}
                            </select>
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
                                        <div className="game_img">
                                            <img src="/images/profile.png" alt="" />
                                        </div>
                                        <div className="profile_box">
                                            <img src="/images/profile.png" alt="" />
                                            <span>
                                                <p>
                                                    게임아이디: {item}
                                                    {index === 0 && <span> (방장)</span>}
                                                </p>
                                            </span>
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
            </div>
        </RoomContainer>
    );
};

export default MafiaGameRoom;
