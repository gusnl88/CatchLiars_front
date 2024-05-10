import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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

    background-image: ${(props) =>
        props.pathname === "/games/list/Catchliars" ? "url('/images/candy0.jpg')" : ""};
    background-size: cover;
    background-position: center;

    color: ${(props) => (props.pathname === "/games/list/Catchliars" ? "black" : "white")};
    box-sizing: border-box;
    .header_font {
        h1 {
            font-size: 30px;
            padding: 20px;
        }
    }
`;

export default function GameWaitingList() {
    const [roomLists, setRoomList] = useState([]);
    const [selectedRoomList, setSelectedRoomList] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const pageSize = 10;
    const { type } = useParams();
    const socketRef = useRef();

    let types = type === "Mafia" ? 1 : 0;

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
    }, [type, types]);

    useEffect(() => {
        const start = (selectedPage - 1) * pageSize;
        const end = start + pageSize;
        setSelectedRoomList(roomLists.slice(start, end));
    }, [selectedPage, roomLists, pageSize]);

    const handleBtn = (page) => {
        setSelectedPage(page);
    };

    const { pathname } = useLocation();
    return (
        <Container pathname={pathname}>
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
