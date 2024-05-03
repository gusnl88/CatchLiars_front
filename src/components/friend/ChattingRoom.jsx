import styled from "styled-components";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react"; // useRef 추가
import { useSelector } from "react-redux";

const Maincontainer = styled.div`
    width: 300px;
    height: 600px;
    position: absolute;
    background: #ffffff92;
    display: flex;
    justify-content: center;
    align-items: center;
    .chatting_container {
        width: 95%;
        height: 95%;
        background: #9298a6f5;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .chatting_main {
            overflow-y: auto; /* 스크롤이 필요할 때만 나타나도록 수정 */
            padding: 10px;
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
                margin: 5px; /* 읽음 표시의 위치 조정 */
                align-items: end;
                display: flex;
            }
            .message {
                display: flex;
                flex-direction: column;

                background-color: yellow;
                color: black;
                border-radius: 10px;
                padding: 5px 10px;
                margin: 5px;

                .time {
                    font-size: 8px;
                    margin: 5px;
                }
                word-break: break-word; /* 긴 단어가 있을 경우 줄바꿈 처리 */
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

export default function ChattingRoom({ roomId, setShowChattingRoom }) {
    const [socket, setSocket] = useState(null);
    const [inputdata, setInputData] = useState("");
    const [msgList, setMsgList] = useState([]);
    const loginUser = useSelector((state) => state.loginReducer.user);
    const chatContainerRef = useRef(null); // Ref 추가

    useEffect(() => {
        console.log(roomId);

        const socket = io(process.env.REACT_APP_API_SERVER);
        setSocket(socket);
        socket.emit("room", { roomId: roomId, userId: loginUser.id, u_seq: loginUser.u_seq });
        socket.on(`message`, (data) => {
            console.log(data);
            let newMessage;
            if (data.sendUser === undefined) {
                console.log("진입");
                newMessage = {
                    content: data.message,
                    type: "notice",
                    is_read: true, // 공지사항은 읽음 상태로 표시
                    // create_at: new Date(),
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
            setMsgList((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("msgList", (data) => {
            console.log(data); // 전체 데이터를 확인합니다.
            setMsgList(data);
            data.forEach((msg) => {
                console.log(msg.User); // 각 메시지의 유저 정보를 확인합니다.
            });
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
        hours = hours ? hours : 12; // 0시를 12시로 변경
        return `${ampm} ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    }
    return (
        <Maincontainer>
            <div className="chatting_container">
                <button onClick={() => setShowChattingRoom(false)}>나가기</button>
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
                            <div className="message">
                                {msg.create_at ? (
                                    <span className="time">{formatDate(msg.create_at)}</span>
                                ) : (
                                    ""
                                )}
                                {msg.type !== "notice" &&
                                    msg.User.id &&
                                    msg.User.id !== loginUser.id && <span>{msg.User.id} </span>}
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chatting_input">
                    <input
                        type="text"
                        value={inputdata}
                        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : "")}
                        onChange={(e) => setInputData(e.target.value)}
                    />
                    <button onClick={sendMessage}>전송</button>
                </div>
            </div>
        </Maincontainer>
    );
}
