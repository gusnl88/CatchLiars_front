import { useEffect, useState } from "react";
import styled from "styled-components";
import axiosUtiils from '../../utils/axiosUtils'
const FriendListContainer = styled.div`
    width: 90%;
    height: 90%;
    max-width: 100%;
    max-height: 100%;
    overflow-y: auto;
    .game_table {
        border-collapse: collapse;
        width: 100%;
        button {
            background-color: #4caf50;
            border: none;
            border-radius: 3px;
            color: white;
            width: 5rem;
            cursor: pointer;
            &:hover {
                background-color: #2e8031;
            }
        }
        th,
        td {
            border: 1px solid #fffcfc;
            padding: 8px;
            text-align: center;
        }
        th {
            background-color: #b15151;
            color: black;
        }
        a {
            text-decoration: none;
            background-color: #4caf50;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            padding: 3px;
        }
    }
    .room_box {
        display: flex;
        justify-content: end;
        button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 10px;
            &:hover {
                background-color: #2e8031;
            }
        }
    }
    .paging_box {
        display: flex;
        justify-content: center;
        button {
            padding: 10px;
            margin: 10px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            &:hover {
                background-color: #777977;
            }
        }
        .active {
            background-color: #ff9300;
            &:hover {
                background-color: #ff9300;
            }
        }
    }
`;

const Friend = ({
    friendList,
    selectedFriendList,
    selectedPage,
    handleBtn,
    pageSize,
    onDeleteFriend,
}) => {
    const pageNumbers = [];
    const [friends, setFriends] = useState(selectedFriendList);
    for (let i = 1; i <= Math.ceil(friendList.length / pageSize); i++) {
        pageNumbers.push(i);
    }
    const deleteFriend = (u_seq) => {
        axiosUtiils
            .delete("/friends", {
                data: { c_seq: u_seq },
                withCredentials: true,
            })
            .then(() => {
                // 친구 삭제 후에 첫 번째 페이지를 보여줌
                onDeleteFriend(u_seq); // 삭제 버튼 클릭 시 상위 컴포넌트의 삭제 함수 호출
            })
            .catch((error) => {
                console.error("친구 삭제 오류:", error);
            });
    };
    useEffect(() => {
        setFriends(selectedFriendList); // selectedFriendList가 변경될 때마다 friends 상태를 업데이트
    }, [selectedFriendList]);

    return (
        <>
            <FriendListContainer>
                <table className="game_table">
                    <thead>
                        <tr>
                            <th>아이디</th>
                            <th>닉네임</th>
                            <th>스코어</th>
                            <th>접속 상태</th>
                            <th>DM</th>
                            <th>친구 삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {friends.map((item) => (
                            <tr key={item.u_seq}>
                                <td>{item.id}</td>
                                <td>{item.nickname}</td>
                                <td>{item.score}</td>
                                <td>
                                    <span style={{ color: item.connect ? "green" : "red" }}>
                                        {item.connect ? "접속중O" : "접속중X"}
                                    </span>
                                </td>
                                <td>
                                    <button style={{ color: "blue" }}>메세지 전송</button>
                                </td>
                                <td>
                                    <button
                                        style={{ color: "red" }}
                                        onClick={() => deleteFriend(item.u_seq)}
                                    >
                                        친구 삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="paging_box">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => handleBtn(number)}
                            className={selectedPage === number ? "active" : ""}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </FriendListContainer>
        </>
    );
};

export default Friend;
