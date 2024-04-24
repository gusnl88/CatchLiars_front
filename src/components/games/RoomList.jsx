// RoomList.js
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const RoomListContainer = styled.div`
    width: 90%;
    height: 90%;
    max-width: 100%;
    max-height: 100%;
    overflow-y: auto;
    .game_table {
        border-collapse: collapse;
        width: 100%;
        th,
        td {
            border: 1px solid #fffcfc;
            padding: 8px;
            text-align: center;
        }
        th {
            background-color: #b15151;
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
        margin: 10px auto;
        button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 10px;
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
        }
        .active {
            background-color: #ff9300;
        }
    }
`;

const RoomList = ({ roomLists, selectedRoomList, selectedPage, handleBtn, RoomRef, pageSize }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(roomLists.length / pageSize); i++) {
        pageNumbers.push(i);
    }

    const roomOpenBtn = () => {
        RoomRef.current.style.display = "block";
    };
    const handler = async (g_seq) => {
        const res = await axios.patch(`http://localhost:8089/games/plus/${g_seq}`);
        if (res.data) {
            window.location.reload();
            alert("입장성공 소켓통신로직구현해야함 (인원수 +됨)");
        }
    };
    return (
        <RoomListContainer>
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
                                    <Link onClick={() => handler(item.g_seq)}>입장</Link>
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
        </RoomListContainer>
    );
};

export default RoomList;
