import styled from "styled-components";
import axiosUtils from "../utils/axiosUtils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 1;
    background-color: #00154b;
    color: white;
    font-size: 100px;
`;
const UserListContainer = styled.div`
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
`;

export default function LankingPage() {
    const [userList, setUserList] = useState([]); // 유저 목록
    const loginUser = useSelector((state) => state.loginReducer.user);

    useEffect(() => {
        axiosUtils.get("/users/lank").then((response) => {
            setUserList(response.data);
        });
    }, []);

    const postFriend = async (u_seq) => {
        const isConfirmed = window.confirm("친구 신청을 하시겠습니까?");

        if (isConfirmed) {
            const response = await axiosUtils.post("/invites", {
                u_seq: u_seq,
                g_seq: "",
                type: 0,
            });
            if (response.data === true) {
                alert("친구신청이 완료되었습니다.");
            } else {
                alert(response.data);
            }
        }
    };

    return (
        <>
            <Container>유저 랭킹</Container>
            <UserListContainer>
                <table className="game_table">
                    <thead>
                        <tr>
                            <th>순위</th>
                            <th>아이디</th>
                            <th>닉네임</th>
                            <th>스코어</th>
                            <th>접속 상태</th>
                            <th>친구 신청</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((item, index) => (
                            <tr key={item.index}>
                                <td>{index + 1}</td>
                                <td>{item.id}</td>
                                <td>{item.nickname}</td>
                                <td>{item.score}</td>
                                <td>
                                    <span style={{ color: item.connect ? "green" : "red" }}>
                                        {item.connect ? "접속중O" : "접속중X"}
                                    </span>
                                </td>
                                <td>
                                    {loginUser.id !== item.id ? (
                                        <button
                                            style={{ color: "blue" }}
                                            onClick={() => postFriend(item.u_seq)}
                                        >
                                            친구 신청
                                        </button>
                                    ) : (
                                        <button disabled style={{ color: "red" }}>
                                            신청 불가
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </UserListContainer>
        </>
    );
}
