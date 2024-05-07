import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MafiaGameRoom from "./MafiaGameRoom";
import RoomRegister from "./RoomRegister";
import GameList from "../main/GameList";
import CatchLiarInGame from "../../pages/CatchLiarInGame";
import axiosUtils from "../../utils/axiosUtils";
import { useLocation } from "react-router-dom";

const RoomListContainer = styled.div`
    /* width: 90%;
    height: 90%; */
    width: ${(props) => (props.pathname === "/games/list/Catchliars" ? "80%" : "90%")};
    height: ${(props) => (props.pathname === "/games/list/Catchliars" ? "97%" : "90%")};
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

            background-color: ${(props) =>
                props.pathname === "/games/list/Catchliars" ? "#c6e2e8" : ""};
            padding: 8px;
            text-align: center;
        }
        th {
            /* background-color: #b15151; */
            background-color: ${(props) =>
                props.pathname === "/games/list/Catchliars" ? "#5ea3ce" : "#b15151"};
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
    @media (max-width: 768px) {
        .game_table {
            font-size: 9px;
            button {
                width: 1rem;
            }
        }
        .room_box {
            button {
                padding: 5px;
                font-size: 10px;
                margin: 5px;
            }
        }
        .paging_box {
            button {
                padding: 5px;
                margin: 5px;
            }
        }
    }
`;

const RoomList = ({ roomLists, selectedRoomList, selectedPage, handleBtn, pageSize, type }) => {
    const [gameStart, setGameStart] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [password, setPassword] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newRoom, setNewRoom] = useState("");
    const [room, setRoom] = useState([]);
    const [pageNumbers, setPageNumbers] = useState([]);
    const InputRef = useRef(null);
    const RoomRef = useRef(null);
    const TitleInput = useRef(null);

    const roomOpenBtn = () => {
        RoomRef.current.style.display = "block";
        TitleInput.current.focus();
    };

    useEffect(() => {
        const numbers = [];
        for (let i = 1; i <= Math.ceil(roomLists.length / pageSize); i++) {
            numbers.push(i);
        }
        setPageNumbers(numbers);
    }, [roomLists, pageSize]);

    useEffect(() => {
        if (newRoom != "") {
            setRoom(newRoom);
            setGameStart(type); //새로운 방을 만들었을떄. (인원수는 디폴트1)
        }
    }, [newRoom]);

    const handleJoinRoom = async (room) => {
        let flag = 1; // 방 입장 가능여부를 의미
        console.log("room", room);
        if (room.g_pw !== null) {
            await setSelectedRoom(room);
            setShowPasswordModal(true);
        } else {
            if (room.g_type) {
                // 마피아
                if (room.g_total >= 8) {
                    alert("방이 꽉 찼습니다. 다른 방을 선택해주세요.");
                    flag = 0;
                }
            } else {
                // 캐치라이어
                if (room.g_total >= 6) {
                    alert("방이 꽉 찼습니다. 다른 방을 선택해주세요.");
                    flag = 0;
                }
            }
            if (flag) {
                try {
                    await joinRoom(room);
                    await setSelectedRoom(room);
                } catch (error) {
                    alert("해당 방은 존재하지 않습니다.");
                    window.location.reload();
                }
            }
        }
    };
    useEffect(() => {
        if (showPasswordModal && InputRef.current) {
            InputRef.current.focus();
        }
    }, [showPasswordModal]);
    const joinRoom = async (room) => {
        // 비밀번호 검사 로직을 통과한 후 입장 처리
        if (room.g_total < 8) {
            await axiosUtils.patch(`/games/plus/${room.g_seq}`);
            setRoom(room);
            setGameStart(type);
        } else {
            alert("방이 꽉 찼습니다. 다른 방을 선택해주세요.");
        }
    };

    const handlePasswordSubmit = () => {
        if (password === selectedRoom.g_pw) {
            joinRoom(selectedRoom.g_seq);
            setShowPasswordModal(false);
        } else {
            alert("비밀번호가 일치하지 않습니다.");
            setPassword("");
        }
    };

    const { pathname } = useLocation();
    console.log(pathname);
    return (
        <>
            <RoomListContainer pathname={pathname}>
                {gameStart ? (
                    gameStart === "Mafia" ? (
                        <MafiaGameRoom room={room} />
                    ) : (
                        <CatchLiarInGame room={room} />
                    )
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
                                        <td>
                                            {item.g_type
                                                ? `${item.g_total}/8`
                                                : `${item.g_total}/6`}
                                        </td>
                                        <td>
                                            <span style={{ color: item.g_state ? "green" : "red" }}>
                                                {item.g_state ? "대기중" : "게임중"}
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
                        <RoomRegister
                            RoomRef={RoomRef}
                            TitleInput={TitleInput}
                            type={type === "Mafia" ? 1 : 0}
                            setNewRoom={setNewRoom}
                        />

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
                                    <button
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPassword("");
                                        }}
                                    >
                                        x
                                    </button>
                                    <h2>비밀번호 입력</h2>
                                    <input
                                        ref={InputRef}
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" ? handlePasswordSubmit() : ""
                                        }
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
