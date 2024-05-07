import styled from "styled-components";
import axiosUtils from "../../utils/axiosUtils"; // Ensure the path and name are correct
import { useEffect, useState } from "react";

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
`;

const FriendItem = styled.li`
    cursor: pointer;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
`;

const FriendInfo = styled.div`
    display: flex;
    align-items: center;
`;

const Divtitle = styled.div`
    margin-bottom: 2rem;
`;

const Buttondiv = styled.div`
    display: flex;
    flex-direction: row;
`;
const StyledLink = styled.div`
    padding: 10px 15px;
    margin-right: 10px; /* Add margin between links */
    color: black; /* 텍스트 색상 */
    text-decoration: none; /* 밑줄 없앰 */
    cursor: pointer;
`;

export default function FriendList() {
    const [friends, setFriends] = useState([]); // State to store friends
    const [expandedIndex, setExpandedIndex] = useState(null); // State to track expanded friend item index

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axiosUtils.get("/friends");
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
        const intervalId = setInterval(fetchFriends, 1000); // 30초마다 친구 목록 갱신

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
    }, []);

    const deleteFriend = async (u_seq) => {
        try {
            const res = await axiosUtils.delete("/friends", {
                data: { c_seq: u_seq },
                withCredentials: true,
            });
            if (res.data) {
                fetchFriends(); // 새로운 친구 목록을 가져오는 함수 호출
            } else {
                console.error("Failed to delete friend");
            }
        } catch (error) {
            console.error("Error deleting friend:", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const res = await axiosUtils.get("/friends"); // 새로운 친구 목록을 가져오는 요청
            setFriends(res.data); // 가져온 데이터로 친구 목록 상태를 업데이트
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    return (
        <MainContainer>
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
                                    <StyledLink>
                                        <a>메시지 전송</a>
                                    </StyledLink>
                                    <StyledLink>
                                        {" "}
                                        <a onClick={() => deleteFriend(item.u_seq)}>친구 삭제</a>
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
    );
}
