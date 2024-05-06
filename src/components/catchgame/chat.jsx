import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Notice from "./Notice";
import "./styles/chat.css";
import "./styles/voteBtn.scss";
import styled from "styled-components";

const socket = io.connect("http://localhost:8089", {
    autoConnect: false,
});

export default function Chat({ loginUser, gameStarted, showModal, setShowModal, timerCount }) {
    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };
    // State 설정
    const [msgInput, setMsgInput] = useState(""); // 메시지 입력 상태
    const [chatList, setChatList] = useState([]); // 채팅 목록 상태
    const [userList, setUserList] = useState({}); // 사용자 목록 상태
    // const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const [userVotes, setUserVotes] = useState({}); // 사용자별 투표 수 상태
    const [hasVoted, setHasVoted] = useState(false);

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
            const type = nick === loginUser.nickName ? "me" : "other";
            const content = message;

            setChatList((prevChatList) => [...prevChatList, { type, content, nick }]);
        });

        socket.on("updateNickname", (nickInfo) => {
            setUserList(nickInfo);
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
    }, []);

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

    const closeModal = () => {
        setShowModal(false);
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

    console.log("유저리스트", Object.values(userList)?.length);

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
                <button className="vote" onClick={handleVoteClick}>
                    투표하기
                </button>
            ) : null}

            {/* 모달창 */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>

                        <p>투표 대상 선택</p> <span>{timerCount}초후 게임이 종료됩니다...</span>
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
