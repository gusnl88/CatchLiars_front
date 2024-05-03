import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import RoomList from "../components/games/RoomList";
import axiosUtils from "../utils/axiosUtils";
import io from "socket.io-client";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 85%;
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
    const socketRef = useRef();

    let types = type === "Mafia" ? 1 : 0;

    // useEffect(() => {
    //     socketRef.current = io("http://localhost:8089");
    //     socketRef.current.on("updateRoomList", (data) => {
    //         setRoomList(data);
    //     });

    //     return () => socketRef.current.disconnect();
    // }, []);


    useEffect(() => {
        const fetchRoomList = async () => {
            try {
                const res = await axiosUtils.get(`/games/list/${types}`);
                setRoomList(res.data);
            } catch (error) {
                console.error("Error fetching room list:", error);
            }
        };

        fetchRoomList();
    }, [type, types]); // roomList가 변경될 때만 useEffect가 실행됩니다.

    useEffect(() => {
        const start = (selectedPage - 1) * pageSize;
        const end = start + pageSize;
        setSelectedRoomList(roomLists.slice(start, end));
    }, [selectedPage, roomLists, pageSize]);

    const handleBtn = (page) => {
        setSelectedPage(page);
    };

    return (
        <Container>
            <RoomList
                roomLists={roomLists}
                selectedRoomList={selectedRoomList}
                selectedPage={selectedPage}
                handleBtn={handleBtn}
                pageSize={pageSize}
                type={type}
            />
        </Container>
    );
}
