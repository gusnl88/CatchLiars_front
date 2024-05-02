import { useEffect, useState } from "react";
import styled from "styled-components";
const ChatListContainer = styled.div`
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

const Chat = ({
    chatList,
    counterList,
    selectedChatList,
    selectedCounterList,
    selectedPage,
    handleBtn,
    pageSize,
}) => {
    const deleteChatRoom = (d_seq) => {
        console.log("=======채팅방 삭제 요청::", d_seq);
    };
    const joinChatRoom = (d_seq) => {
        console.log("=======채팅방 입장 요청::", d_seq);
    };
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(chatList.length / pageSize); i++) {
        pageNumbers.push(i);
    }

    const [chatInfo1, setChatInfo1] = useState(selectedChatList);
    const [chatInfo2, setChatInfo2] = useState(selectedCounterList);

    useEffect(() => {
        setChatInfo1(selectedChatList);
        setChatInfo2(selectedCounterList);
    }, [selectedChatList, selectedCounterList]);

    return (
        <>
            <ChatListContainer>
                <table className="game_table">
                    <thead>
                        <tr>
                            <th>채팅방 제목? 상대방</th>
                            <th>접속 상태</th>
                            <th>채팅방 들어가기</th>
                            <th>채팅방 알림</th>
                            <th>채팅방 삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chatInfo2.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.nickname}</td>
                                    <td>
                                        <span style={{ color: item.connect ? "green" : "red" }}>
                                            {item.connect ? "접속중O" : "접속중X"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            style={{ color: "red" }}
                                            onClick={() => joinChatRoom(chatList[index].d_seq)}
                                        >
                                            채팅방 입장
                                        </button>
                                    </td>
                                    <td>{chatInfo1[index].unreadcnt}</td>
                                    <td>
                                        <button
                                            style={{ color: "red" }}
                                            onClick={() => deleteChatRoom(chatList[index].d_seq)}
                                        >
                                            채팅방 삭제
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
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
            </ChatListContainer>
        </>
    );
};

export default Chat;
