import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
const roomList1 = [
    {
        g_seq: 0,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 3,
        g_state: true,
        g_type: 1,
    },
    {
        g_seq: 1,
        g_title: "라이어를 잡아보자!!!?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 4,
        g_state: false,
        g_type: 1,
    },
    {
        g_seq: 2,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 3,
        g_state: true,
        g_type: 1,
    },
    {
        g_seq: 3,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 7,
        g_state: false,
        g_type: 1,
    },
    {
        g_seq: 4,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 1,
    },
    {
        g_seq: 5,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 1,
    },
    {
        g_seq: 0,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 1,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 2,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 3,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 4,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 5,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 6,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
    {
        g_seq: 7,
        g_title: "한판 같이 해볼까?",
        g_jjang: "gamemaster",
        g_pw: null,
        g_total: 8,
        g_state: false,
        g_type: 0,
    },
];
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 화면의 높이에 따라 조절됩니다. */
    background-color: #00154b;
    color: white;
    box-sizing: border-box; /* 내부 패딩까지 높이에 포함시키기 위해 */
    .header_font {
        h1 {
            font-size: 30px;
            padding: 20px;
        }
    }
    .game_list {
        width: 90%;
        height: 90%;
        max-width: 100%;
        max-height: 100%;
        overflow-y: auto;
        /* 다른 스타일들 */

        .game_table {
            border-collapse: collapse; /* 테이블 셀 사이의 간격 없애기 */
            width: 100%;
            th,
            td {
                border: 1px solid #fffcfc; /* 테이블 테두리 선 스타일 지정 */
                padding: 8px; /* 셀 안의 컨텐츠와 셀 테두리 사이의 간격 */
                text-align: center; /* 셀 안의 텍스트 왼쪽 정렬 */
            }
            th {
                background-color: #b15151; /* 테이블 헤더 배경색 */
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
        }
        .active {
            background-color: gray;
        }
    }
    .room_register {
        position: absolute;
        border: 1px solid black;
        width: 70%;
        height: 50%;
        background-color: gray;
        display: none;
        .close_btn {
            text-align: end;
            margin: 10px;
        }
    }
`;

export default function CatchLiars() {
    const [roomLists, setRoomList] = useState([]); // 전체 룸리스트
    const [selectedRoomList, setSelectedRoomList] = useState([]);
    const [selectedPage, setSelectedPage] = useState(1);
    const pageSize = 3; // 10으로 설정 할것.
    const { type } = useParams();
    const RoomRef = useRef(null);

    useEffect(() => {
        let filteredList;
        if (type === "mapia") {
            filteredList = roomList1.filter((item) => item.g_type === 1);
        } else {
            filteredList = roomList1.filter((item) => item.g_type === 0);
        }
        setRoomList(filteredList);
        setSelectedPage(1);
    }, [type]);

    useEffect(() => {
        const start = (selectedPage - 1) * pageSize;
        const end = start + pageSize;
        setSelectedRoomList(roomLists.slice(start, end));
    }, [selectedPage, roomLists]);

    const handleBtn = (page) => {
        setSelectedPage(page);
    };

    const pageNumbers = Array.from(
        { length: Math.ceil(roomLists.length / pageSize) },
        (_, index) => index + 1
    );
    const roomOpenBtn = () => {
        RoomRef.current.style.display = "block";
    };
    const closeBtn = () => {
        RoomRef.current.style.display = "none";
    };
    return (
        <Container>
            <div className="header_font">
                <h1>Room List</h1>
            </div>
            <div className="game_list">
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
                                    <span style={{ color: item.g_state ? "red" : "green" }}>
                                        {item.g_state ? "시작중" : "대기중"}
                                    </span>
                                </td>
                                <td>
                                    {item.g_state ? (
                                        <span style={{ color: "red" }}>입장불가</span>
                                    ) : (
                                        <Link>입장</Link>
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
            </div>
            <div ref={RoomRef} className="room_register">
                <div className="close_btn">
                    <button onClick={closeBtn}>x</button>
                </div>
                하하하
            </div>
        </Container>
    );
}
