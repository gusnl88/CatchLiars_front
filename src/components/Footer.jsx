import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import FriendList from "./friend/FriendList";
import ChattingList from "./friend/ChattingList";

const Footers = styled.footer`
    display: flex;
    justify-content: end;
    background-color: ${(props) =>
        props.pathname === "/games/list/Catchliars" ? "pink" : "#00154b"};
    height: 5%;
    button {
        background-color: #00154b;
        color: white;
        font-size: 20px;
        font-weight: bold;
        border: none;
        margin: 10px;
        cursor: pointer;
        &:hover {
            color: skyblue;
        }
    }
    .friend,
    .chatting {
        width: 300px;
        height: 600px;
        position: absolute;
        background: #ffffff92;
        top: 100px;
        border-radius: 10px;
    }
`;

const StyledLink = styled.div`
    padding: 10px 15px;
    margin: 5px;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    cursor: pointer;
`;

export default function Footer() {
    const [friendCheck, setFriendCheck] = useState(false);
    const [chattingCheck, setChattingCheck] = useState(false);

    const friendBtn = () => {
        setFriendCheck((prevState) => !prevState);
        if (chattingCheck) {
            setChattingCheck(false);
        }
    };

    const chattingBtn = () => {
        setChattingCheck((prevState) => !prevState);
        if (friendCheck) {
            setFriendCheck(false);
        }
    };

    const { pathname } = useLocation();
    console.log(pathname);

    // 메시지 클릭 시 1:1 대화방 생성
    const handleCreateDM = (otherUserId) => {
        fetch("/api/createDM", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId: otherUserId,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // 생성된 대화방으로 이동
                if (data.success) {
                    window.location.href = `/chat/${data.d_seq}`;
                } else {
                    alert("대화방 생성에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("Error creating DM:", error);
                alert("대화방 생성 중 오류가 발생했습니다.");
            });
    };

    return (
        <Footers pathname={pathname}>
            <StyledLink>
                <a onClick={chattingBtn}>채팅</a>
            </StyledLink>
            {chattingCheck ? <ChattingList /> : ""}
            <StyledLink>
                <a onClick={friendBtn}>친구목록</a>
            </StyledLink>
            {friendCheck ? <FriendList /> : ""}
        </Footers>
    );
}
