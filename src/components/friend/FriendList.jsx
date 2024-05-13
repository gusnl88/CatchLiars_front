import React, { useState } from "react";
import styled from "styled-components";
import axiosUtils from "../../utils/axiosUtils";
import { useEffect } from "react";
import ChattingRoom from "./ChattingRoom";
import ChattingList from "./ChattingList";
import { useSelector } from "react-redux";

const MainContainer = styled.div`
    width: 300px;
    height: 550px;
    position: absolute;
    background: #ffffffaf;
    top: 150px;
    transform: translateX(-5%);
    border-radius: 10px;
    padding: 20px;
    overflow-y: auto;

    @media (max-width: 768px) {
        width: 200px;
        height: 400px;

        top: 250px;
    }
`;

const CloseButton = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
`;

const FriendItem = styled.li`
    cursor: pointer;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const ArrowIcon = styled.span`
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    background: url("/images/down.png");
    background-size: contain;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.expanded ? "rotate(0deg)" : "rotate(180deg)")};
    margin-left: auto;

    @media screen and (max-width: 600px) {
        margin-left: 0;
        display: none;
    }
`;

const FriendInfo = styled.div`
    display: flex;
    align-items: center;

    @media screen and (max-width: 600px) {
        font-size: 12px;
    }
`;

const Divtitle = styled.div`
    margin-bottom: 2rem;
`;

const Buttondiv = styled.div`
    display: flex;
    flex-direction: row;

    @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;
const StyledLink = styled.div`
    background-color: #00154b;
    border-radius: 10px;
    color: white;
    padding: 2px;
    margin-left: 10px;
    margin-right: 10px;
    text-decoration: none;
    cursor: pointer;

    @media screen and (max-width: 600px) {
        background-color: #00154b;
        border-radius: 10px;
        color: white;
        margin: 1px;
        font-size: 10px;
        padding: 5px;
    }
`;

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [showChattingRoom, setShowChattingRoom] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const loginUser = useSelector((state) => state.loginReducer.user);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await axiosUtils.get("/friends");
                setFriends(res.data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
        const intervalId = setInterval(fetchFriends, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const sendMessage = async (f_seq) => {
        const res = await axiosUtils.post("/dms", {
            firstUser: loginUser.u_seq,
            secondUser: f_seq,
        });
        setCurrentRoomId(res.data.d_seq);
        setShowChattingRoom(true);
    };

    const closeModal = () => setShowModal(false);

    const deleteFriend = async (u_seq) => {
        try {
            const res = await axiosUtils.delete("/friends", {
                data: { c_seq: u_seq },
                withCredentials: true,
            });
            if (res.data) {
                fetchFriends();
            } else {
                console.error("Failed to delete friend");
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const res = await axiosUtils.get("/friends/list");
            setFriends(res.data);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    if (showChattingRoom) {
        return <ChattingList />;
    }

    return (
        showModal && (
            <MainContainer>
                <CloseButton onClick={closeModal}>x</CloseButton>
                <Divtitle>
                    <h3>친구 목록</h3>
                </Divtitle>
                {friends.length > 0 ? (
                    <ul>
                        {friends.map((item, index) => (
                            <FriendItem key={item.u_seq} onClick={() => toggleExpand(index)}>
                                <FriendInfo>
                                    {item.nickname} -{" "}
                                    <span style={{ color: item.connect ? "green" : "red" }}>
                                        {item.connect ? "접속중O" : "접속중X"}
                                    </span>
                                </FriendInfo>

                                {expandedIndex === index && (
                                    <Buttondiv>
                                        <StyledLink onClick={() => sendMessage(item.u_seq)}>
                                            채팅
                                        </StyledLink>
                                        <StyledLink onClick={() => deleteFriend(item.u_seq)}>
                                            친구 삭제
                                        </StyledLink>
                                    </Buttondiv>
                                )}
                                <ArrowIcon expanded={expandedIndex === index} />
                            </FriendItem>
                        ))}
                    </ul>
                ) : (
                    <p>친구가 없습니다.</p>
                )}
            </MainContainer>
        )
    );
}
