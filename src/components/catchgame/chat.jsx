import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Notice from "./Notice";
import "./styles/chat.css";

const socket = io.connect("http://localhost:8089", {
    autoConnect: false,
});

export default function Chat({ loginUser }) {
    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };
    // State 설정
    const [msgInput, setMsgInput] = useState(""); // 메시지 입력 상태
    const [chatList, setChatList] = useState([]); // 채팅 목록 상태
    const [userList, setUserList] = useState({}); // 사용자 목록 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태

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

        // 소켓 연결
        // socket.connect();

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

    console.log(chatList);

    const handleVoteClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

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
            <button className="vote" onClick={handleVoteClick}>
                투표하기
            </button>

            {/* 모달창 */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <p>모달 내용</p>
                    </div>
                </div>
            )}
        </div>
    );
}
