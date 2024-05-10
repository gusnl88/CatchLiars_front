import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
        friendCheck ? setFriendCheck(false) : setFriendCheck(true);
        if (chattingCheck) {
            setChattingCheck(false);
        }
    };
    const { pathname } = useLocation();
    console.log(pathname);
    const chattingBtn = () => {
        chattingCheck ? setChattingCheck(false) : setChattingCheck(true);
        if (friendCheck) {
            setFriendCheck(false);
        }
    };
    return (
        <Footers pathname={pathname}>

             <StyledLink>
                <a onClick={chattingBtn }>채팅</a>

            </StyledLink>
            {chattingCheck ? <ChattingList setChattingCheck={setChattingCheck} /> : ""}
            <StyledLink>
                <a onClick={friendBtn}>친구목록</a>
            </StyledLink>
            {friendCheck ? <FriendList /> : ""}
        </Footers>
    );
}
