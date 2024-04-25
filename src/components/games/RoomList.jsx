// RoomList.js
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MafiaGameRoom from "./MafiaGameRoom";

const RoomListContainer = styled.div`
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
            width: 4rem;
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
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        color: black;
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        h2 {
            text-align: center;
            margin: 15px;
        }
    }
`;

const RoomList = ({
    roomLists,
    selectedRoomList,
    selectedPage,
    handleBtn,
    RoomRef,
    pageSize,
    type,
}) => {
    const [gameStart, setGameStart] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [password, setPassword] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(roomLists.length / pageSize); i++) {
        pageNumbers.push(i);
    }

    const roomOpenBtn = () => {
        RoomRef.current.style.display = "block";
    };
    const handler = async (g_seq) => {
        // const res = await axios.patch(`http://localhost:8089/games/plus/${g_seq}`); 방인원수 증가 api
        // if (res.data) {
        //     window.location.reload();
        //     alert("입장성공 소켓통신로직구현해야함 (인원수 +됨)");
        // }
        setGameStart(true);
    };

    const handleJoinRoom = (room) => {
        console.log(room);
        if (room.g_pw !== null) {
            setSelectedRoom(room);
            setShowPasswordModal(true);
        } else {
            joinRoom(room.g_seq);
        }
    };

    const joinRoom = (roomId) => {
        // 비밀번호 검사 로직을 통과한 후 입장 처리
        setGameStart(true);
    };

    const handlePasswordSubmit = () => {
        if (password === selectedRoom.g_pw) {
            console.log(password, "or", selectedRoom.g_pw);
            joinRoom(selectedRoom.g_seq);
            setShowPasswordModal(false);
        } else {
            alert("비밀번호가 일치하지 않습니다.");
            setPassword("");
        }
    };
    return (
        <>
            <RoomListContainer>
                {gameStart ? (
                    <MafiaGameRoom />
                ) : (
                    <div>
                        <div className="header_font">
                            <h1>{type} Room List</h1>
                        </div>
                        <table className="game_table">
                            <thead>
                                <tr>
                                    <th>방 번호</th>
                                    <th>방 제목</th>
                                    <th>공개 여부</th>
                                    <th>인원</th>
                                    <th>상태</th>
                                    <th>공백</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRoomList.map((item) => (
                                    <tr key={item.g_seq}>
                                        <td>{item.g_seq}</td>
                                        <td>{item.g_title}</td>
                                        <td>{item.g_pw === null ? "공개" : "비공개"}</td>
                                        <td>{item.g_total}/8</td>
                                        <td>
                                            <span style={{ color: item.g_state ? "green" : "red" }}>
                                                {item.g_state ? "대기중" : "시작중"}
                                            </span>
                                        </td>
                                        <td>
                                            {item.g_state ? (
                                                <button onClick={() => handleJoinRoom(item)}>
                                                    입장
                                                </button>
                                            ) : (
                                                <span style={{ color: "red" }}>입장불가</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="room_box">
                            <button onClick={roomOpenBtn}>방 만들기</button>
                        </div>
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
                        {/* 비밀번호 입력 모달 */}
                        {showPasswordModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <button onClick={() => setShowPasswordModal(false)}>x</button>
                                    <h2>비밀번호 입력</h2>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button onClick={handlePasswordSubmit}>확인</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </RoomListContainer>
        </>
    );
};

export default RoomList;
