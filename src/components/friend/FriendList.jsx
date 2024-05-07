import React, { useState } from "react";
import styled from "styled-components";
import axiosUtils from "../../utils/axiosUtils";
import { useEffect } from "react";
import ChattingRoom from "./ChattingRoom";
import { useSelector } from "react-redux";

const MainContainer = styled.div`
    width: 500px;
    height: 600px;
    position: absolute;
    background: #ffffffaf;
    top: 80px;
    transform: translateX(-5%);
    border-radius: 10px;
    padding: 20px;
    overflow-y: auto;

    @media (max-width: 768px) {
        width: 200px;
        height: 400px;
        left: 70%;
        transform: translateX(-50%);
        top: 350px;
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
        /* 화면 너비가 600px 이하일 때 적용되는 스타일 */
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
        /* 화면 너비가 600px 이하일 때 적용되는 스타일 */
        margin-left: 0; /* 추가된 스타일 */
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
        /* 화면 너비가 600px 이하일 때 적용되는 스타일 */
        flex-direction: column;
        align-items: flex-start;
    }
`;
const StyledLink = styled.div`
    padding: 10px 15px;
    margin-right: 10px;
    color: black;
    text-decoration: none;
    cursor: pointer;

    @media screen and (max-width: 600px) {
        /* 화면 너비가 600px 이하일 때 적용되는 스타일 */
        font-size: 14px;
        margin-right: 0px;
        padding: 5px;
    }
`;

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [showChattingRoom, setShowChattingRoom] = useState(false); // 채팅방 표시 여부
    const [currentRoomId, setCurrentRoomId] = useState(null); // 현재 채팅방 ID
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
        const intervalId = setInterval(fetchFriends, 1000); // 30초마다 친구 목록 갱신

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
    }, []);

    const sendMessage = async (f_seq) => {
        const res = await axiosUtils.post("/dms", {
            firstUser: loginUser.u_seq,
            secondUser: f_seq,
        });
        setCurrentRoomId(res.data.d_seq); // 현재 채팅방 ID 설정
        setShowChattingRoom(true); // 채팅방을 보여줍니다.
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
        return <ChattingRoom roomId={currentRoomId} setShowChattingRoom={setShowChattingRoom} />;
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
                                            메시지 전송
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
