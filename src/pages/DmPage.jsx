import { useEffect, useState } from "react";
import axiosUtils from "../utils/axiosUtils";
import styled from "styled-components";
import Chat from "../components/mypage/Chat";
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 1;
    background-color: #00154b;
    color: white;
    font-size: 100px;
`;

export default function DmPage() {
    const [chatList, setChatList] = useState([]);
    const [counterList, setCounterList] = useState([]);
    const [selectedChatList, setSelectedChatList] = useState([]);
    const [selectedCounterList, setSelectedCounterList] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        axiosUtils
            .get("/dms")
            .then((response) => {
                setChatList(response.data.dmInfo);
                setCounterList(response.data.counterInfo);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const start = (selectedPage - 1) * pageSize;
        const end = start + pageSize;
        setSelectedChatList(chatList.slice(start, end));
        setSelectedCounterList(counterList.slice(start, end));
    }, [selectedPage, chatList, counterList]);

    const handleBtn = (page) => {
        setSelectedPage(page);
    };

    return (
        <>
            <Container>채팅목록</Container>
            <Chat
                chatList={chatList}
                counterList={counterList}
                selectedChatList={selectedChatList}
                selectedCounterList={selectedCounterList}
                selectedPage={selectedPage}
                handleBtn={handleBtn}
                pageSize={pageSize}
            ></Chat>
        </>
    );
}
