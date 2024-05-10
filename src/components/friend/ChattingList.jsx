import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosUtils from "../../utils/axiosUtils";
import ChattingRoom from "./ChattingRoom";
import { useSelector } from "react-redux";

const MainContainer = styled.div`
    width: 300px;
    height: 600px;
    position: absolute;
    background: #ffffff92;
    right: 10px;
    top: 165px;
    border-radius: 10px;
    .chatting_box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            color: #333;
        }
        .chatting_list {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 8px;
            background-color: #f5f5f5b3;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
            cursor: pointer;
            cursor: pointer;
            &:hover {
                background-color: #e0e0e0;
            }
            div {
                flex: 1;
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
            button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                background-color: #4caf50;
                color: white;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                &:hover {
                    background-color: #45a049;
                }
            }
            .unreadcnt {
                text-align: center;
                align-content: center;
                font-size: 10px;
                background-color: yellow;
                border-radius: 50%;
            }
        }
    }
    @media (max-width: 768px) {
        width: 210px;
        height: 500px;
    }
`;

const CloseButton = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
`;

export default function FriendList() {
    const [chattingList, setChattingList] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [showChattingRoom, setShowChattingRoom] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const loginUser = useSelector((state) => state.loginReducer.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosUtils.get("/dms");
                console.log(res);
                setChattingList(res.data.dmInfo);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleRoomSelect = (roomId) => {
        setSelectedRoomId(roomId);
        setShowChattingRoom(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    console.log(chattingList)
    return (
        showModal && (
            <MainContainer>
                <CloseButton onClick={closeModal}>x</CloseButton>
                <div className="chatting_box">
                    <h3>채팅방 리스트</h3>
                    {chattingList.map((item, index) => (
                        <div
                            className="chatting_list"
                            key={index}
                            onClick={() => handleRoomSelect(item.d_seq)}
                        >
                            <div>{item.counterInfo.id}</div>

                            {Number(item.last_seq) != Number(loginUser.u_seq)?
                                <span className="unreadcnt">{item.unreadcnt?item.unreadcnt:""}</span>:""}
                            <button>채팅</button>

                        </div>
                    ))}
                    {showChattingRoom && (
                        <ChattingRoom
                            setShowChattingRoom={setShowChattingRoom}
                            roomId={selectedRoomId}
                        />
                    )}
                </div>
            </MainContainer>
        )
    );
}
