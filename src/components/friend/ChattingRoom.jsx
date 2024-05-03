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
            input{
                margin: 10px auto;
            }
        }
        .me{
            text-align: end;
        }
        .other{
            text-align: start;
        }
        .notice{
            text-align: center;
            background-color: #8080807a;
            margin: 10px;
            border-radius: 4px;
        }
    }
`;
export default function ChattingRoom({roomId}) {
    const [socket,setSocket]=useState(null)
    const [messages,setMessages]=useState([])
    const [inputdata,setInputData]=useState("")
    const loginUser=useSelector((state)=>state.loginReducer.user)

    useEffect(()=>{
        console.log(roomId)

        const socket =io(process.env.REACT_APP_API_SERVER)
        setSocket(socket)
        socket.emit("room",{roomId:roomId,userId:loginUser.id})
        socket.on(`message`,(data)=>{
            console.log(data.sendUser)
            let newMessage;
            if(data.sendUser===undefined){
                console.log('진입')
                newMessage = {
                    message: data.message,
                    type: "notice"
                };
            }else{
                if(!data.out===undefined){
                    console.log("모두접속")

                    const type = data.sendUser === loginUser.id ? "me" : "other";
                    newMessage = {
                        message: data.message,
                        type: type
                    };

                }else{
                    console.log("한명접속")
                }
                
            }
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        })
        
        return () => {
            socket.disconnect();
        };
    },[roomId])

    const sendMessage = () => {
        if (inputdata.trim() !== "") {
            socket.emit("send", {msg: inputdata, roomId: roomId, loginUser: loginUser.id});
            setInputData("");
        }
    };

    return (
        <Maincontainer>
            <div className="chatting_container">
                <div className="chatting_main">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.type==="me"?"me":msg.type ==="notice"?"notice":"other"}>
                            {msg.message}
                        </div>
                    ))}
                </div>
                <div className="chatting_input">
                    <input type="text" value={inputdata} onKeyDown={(e) => e.key === "Enter" ? sendMessage() : ""} onChange={(e) => setInputData(e.target.value)} />
                    <button onClick={sendMessage}>전송</button>
                </div>
            </div>
        </Maincontainer>
    );
}
