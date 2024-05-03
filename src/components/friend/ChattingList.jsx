import styled from "styled-components";
import axiosUtills from "../../utils/axiosUtils";
import { useEffect, useState } from "react";
import ChattingRoom from "./ChattingRoom";

const MainContainer = styled.div`
    width: 300px;
    height: 600px;
    position: absolute;
    background: #ffffff92;
    top: 100px;
    border-radius: 10px;
    .chatting_box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
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
        }
    }
`;

export default function FriendList() {
    const [chattingList, setChattingList] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [showChattingRoom, setShowChattingRoom] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosUtills.get("/dms");
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

    return (
        <MainContainer>
            <div className="chatting_box">
                <h3>채팅방 리스트</h3>
                {chattingList.map((item, index) => (
                    <div
                        className="chatting_list"
                        key={index}
                        onClick={() => handleRoomSelect(item.d_seq)}
                    >
                        <div>{item.counterInfo.id}</div>
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
    );
}
