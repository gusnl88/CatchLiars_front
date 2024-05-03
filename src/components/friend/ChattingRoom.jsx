import styled from "styled-components";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Maincontainer = styled.div`
    width: 300px;
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
        background: #0000ff57;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .chatting_main {
        }
        .chatting_input {
            display: flex;
            justify-content: center;
            input {
                margin: 10px auto;
            }
        }
        .me {
            text-align: end;
            margin: 5px auto;
        }
        .other {
            text-align: start;
            margin: 5px auto;
        }
        .notice {
            text-align: center;
            background-color: #8080807a;
            margin: 10px;
            border-radius: 4px;
        }
    }
`;
export default function ChattingRoom({ roomId }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputdata, setInputData] = useState("");
    const [msgList, setMsgList] = useState([]);
    const loginUser = useSelector((state) => state.loginReducer.user);

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
                    message: data.message,
                    type: "notice",
                };
            } else {
                const type = data.sendUser === loginUser.id ? "me" : "other";
                newMessage = {
                    message: data.message,
                    type: type,
                };
            }
            setMessages((prevMessages) => [...prevMessages, newMessage]);
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
    return (
        <Maincontainer>
            <div className="chatting_container">
                <div className="chatting_main">
                    {msgList.map((msg) => (
                        <div
                            key={msg.id}
                            className={msg.User && msg.User.id === loginUser.id ? "me" : "other"}
                        >
                            {msg.User
                                ? `${msg.User.id}: ${msg.content}`
                                : `Unknown User: ${msg.content}`}
                        </div>
                    ))}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={
                                msg.type === "me"
                                    ? "me"
                                    : msg.type === "notice"
                                    ? "notice"
                                    : "other"
                            }
                        >
                            {msg.message}
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
