import styled from "styled-components";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

const UserId = styled.div`
    color: black;
    font-weight: bold;
    margin-bottom: 5px;
    margin-left: 5px;
`;

const ChatTitle = styled.div`
    font-size: 20px;
    color: #ececec;
    font-weight: bold;
    padding: 10px;
    background-color: rgba(0, 21, 75, 0.7);
    text-align: center;
`;
const Maincontainer = styled.div`
    width: 300px;
    height: 550px;
    bottom: 20px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        width: 300px;
        height: 500px;
        right: 0;
        bottom: 0;
        margin-bottom: 10px;
    }
    .chatting_container {
        width: 85%;
        height: 95%;
        background: #9298a6ba;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .chatting_main {
            overflow-y: auto;
            padding: 10px;
            height: 100%;
            max-height: calc(100% - 100px);
            &::-webkit-scrollbar {
                width: 8px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 4px;
            }
            &::-webkit-scrollbar-track {
                background-color: #f1f1f1;
            }
        }
        .chatting_input {
            display: flex;
            justify-content: center;
            input {
                margin: 10px auto;
            }
        }
        .message-container {
            display: flex;
            justify-content: flex-end;
            &.received {
                justify-content: flex-start;
            }

            .read {
                color: blue;
                font-size: 6px;
                margin: 5px;
                align-items: end;
                display: flex;
            }
            .message {
                display: flex;
                flex-direction: row;
                align-items: center;
                background-color: yellow;
                color: black;
                border-radius: 10px;
                padding: 5px 10px;
                margin: 5px;

                .time {
                    font-size: 8px;
                    margin-right: 10px;
                }
                word-break: break-word;
            }
        }
        .received .message {
            background-color: white;
        }
        .notice {
            text-align: center;
            background-color: #8080807a;
            margin: 10px;
            border-radius: 4px;
            .message {
                background-color: #8080807a;
            }
        }
    }
`;

const BottomDiv = styled.div`

    justify-content: center; // 수평 중앙 정렬
    align-items: center; // 수직 중앙 정렬

`;

const CloseButton = styled.button`
    left: 3%;
    width: 90%;
`;

const SendButton = styled.button`
    right: 3%;
    width: 20%;
`;

const MessageInput = styled.input`
    width: 65%;
`;

export default function ChattingRoom({ roomId, setShowChattingRoom }) {
    const [socket, setSocket] = useState(null);
    const [inputdata, setInputData] = useState("");
    const [msgList, setMsgList] = useState([]);
    const [chatPartner, setChatPartner] = useState("");
    const loginUser = useSelector((state) => state.loginReducer.user);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        console.log(roomId);

        const socket = io(process.env.REACT_APP_API_SERVER);
        setSocket(socket);
        socket.emit("room", { roomId: roomId, userId: loginUser.id, u_seq: loginUser.u_seq });
        socket.on(`message`, (data) => {
            console.log(data);
            let newMessage;
            if (data.sendUser === undefined) {
                newMessage = {
                    content: data.message,
                    type: "notice",
                    is_read: true,
                };
            } else {
                const type = data.sendUser === loginUser.id ? "me" : "other";
                newMessage = {
                    content: data.message,
                    type: type,
                    is_read: data.is_read,
                    create_at: data.create_at,
                    User: { id: data.sendUser },
                };
            }
            if (newMessage.type === "other" && newMessage.User && newMessage.User.id) {
                setChatPartner(newMessage.User.id);
            }
            setMsgList((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("msgList", (messages) => {
            setMsgList(messages);
            const otherUserMessage = messages.find((m) => m.User && m.User.id !== loginUser.id);
            if (otherUserMessage) {
                setChatPartner(otherUserMessage.User.id);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [msgList]);

    const sendMessage = () => {
        if (inputdata.trim() !== "") {
            socket.emit("send", {
                msg: inputdata,
                roomId: roomId,
                loginUser: loginUser.id,
                u_seq: loginUser.u_seq,
            });
            setInputData("");
        }
    };
    function formatDate(dateString) {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "오후" : "오전";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${ampm} ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    }
    return (
        <Maincontainer>
            <div className="chatting_container">
                <ChatTitle>{chatPartner}</ChatTitle>

                <div ref={chatContainerRef} className="chatting_main">
                    {msgList.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-container ${
                                msg.type === "notice"
                                    ? "notice"
                                    : msg.User && msg.User.id !== loginUser.id
                                    ? "received"
                                    : ""
                            }`}
                        >
                            {msg.type !== "notice" && !msg.is_read && (
                                <span className="read">1</span>
                            )}
                            <div>
                                {msg.type !== "notice" &&
                                    msg.User.id &&
                                    msg.User.id !== loginUser.id && <UserId>{msg.User.id} </UserId>}
                                <div className="message">
                                    {msg.create_at ? (
                                        <span className="time">{formatDate(msg.create_at)}</span>
                                    ) : (
                                        ""
                                    )}

                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <BottomDiv>
                    <div className="chatting_input">
                        <MessageInput
                            type="text"
                            value={inputdata}
                            onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : "")}
                            onChange={(e) => setInputData(e.target.value)}
                        />
                        <SendButton onClick={sendMessage}>전송</SendButton>
                    </div>
                    <CloseButton onClick={() => setShowChattingRoom(false)}>나가기</CloseButton>
                </BottomDiv>
            </div>
        </Maincontainer>
    );
}
