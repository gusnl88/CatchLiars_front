import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

const RoomRegisterContainer = styled.div`
    position: absolute;
    border: 1px solid black;
    border-radius: 10px;
    width: 40%;
    background-color: #8b8585e0;
    display: none;
    .close_btn {
        text-align: end;
        margin: 10px;

        button {
            font-size: 15px;
            cursor: pointer;
            &:hover {
                background-color: #8b8585e0;
            }
        }
    }
    form {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        input {
            margin: 5px;
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        button {
            margin-top: 10px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #4caf50;
            color: white;
            cursor: pointer;
        }
    }
`;

const RoomRegister = ({ RoomRef, closeBtn, type }) => {
    const [title, setTitle] = useState("");
    const [pw, setPw] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`http://localhost:8089/games/`, { title, pw, type });
        console.log(res);
        if (res.data) {
            // ocket.emit("join_room", { title, pw, type }); // 방 정보를 소켓으로 전달
            // window.location.href = "/"; // 홈페이지로 이동
            window.location.reload();
            alert("생성완료 이후로직 소켓통신접속");
        }
    };

    return (
        <RoomRegisterContainer ref={RoomRef} className="room_register">
            <div className="close_btn">
                <button onClick={closeBtn}>x</button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="방 제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={20}
                />
                <label>
                    비공개
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => {
                            setIsPrivate(e.target.checked);
                            if (!e.target.checked) {
                                setPw(null); // 비공개 체크 해제 시, 비밀번호 초기화
                            }
                        }}
                    />
                </label>
                {isPrivate && (
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        maxLength={20}
                    />
                )}
                <button type="submit">방 만들기</button>
            </form>
        </RoomRegisterContainer>
    );
};

export default RoomRegister;