// GameWaitingList.js
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import RoomRegister from "../components/games/RoomRegister";
import RoomList from "../components/games/RoomList";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #00154b;
    color: white;
    box-sizing: border-box;
    .header_font {
        h1 {
            font-size: 30px;
            padding: 20px;
        }
    }
`;

export default function GameWaitingList() {
    const [roomLists, setRoomList] = useState([]); // 전체 룸리스트
    const [selectedRoomList, setSelectedRoomList] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const pageSize = 10; // 10으로 설정 할것.
    const { type } = useParams();
    const RoomRef = useRef(null);

    useEffect(() => {
        let types = type === "Mapia" ? 1 : 0;
        const fetchRoomList = async () => {
            try {
                const response = await axios.get(`http://localhost:8089/games/${types}`);
                setRoomList(response.data);
            } catch (error) {
                console.error("Error fetching room list:", error);
            }
        };

        fetchRoomList();
    }, []);

    useEffect(() => {
        const start = (selectedPage - 1) * pageSize;
        const end = start + pageSize;
        setSelectedRoomList(roomLists.slice(start, end));
    }, [selectedPage, roomLists]);

    const handleBtn = (page) => {
        setSelectedPage(page);
    };
    const closeBtn = () => {
        RoomRef.current.style.display = "none";
    };
    return (
        <Container>
            <div className="header_font">
                <h1>{type} Room List</h1>
            </div>
            <RoomList
                roomLists={roomLists}
                selectedRoomList={selectedRoomList}
                selectedPage={selectedPage}
                handleBtn={handleBtn}
                RoomRef={RoomRef}
                pageSize={pageSize}
            />
            <RoomRegister RoomRef={RoomRef} closeBtn={closeBtn} type={type === "mapia" ? 1 : 0} />
        </Container>
    );
}
