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
    font-size: 70px;
`;
const UserListContainer = styled.div`
    width: 100%;
    height: 100%;
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
        th {
            border: 1px solid #fffcfc;
            padding: 8px;
            text-align: center;
        }
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

const StyledTr = styled.tr`
    background-color: ${(props) => (props.isSelf ? "#F6F6F6" : "none")};
    border: ${(props) => (props.isSelf ? "3px solid yellow" : "none")};
    color: black;
`;

const SearchDiv = styled.div`
    text-align: right;
    padding-right: 1rem;
`;

const SearchButton = styled.button`
    background: none;
    border: none;
`;
export default function LankingPage() {
    const [userList, setUserList] = useState([]); // 유저 목록
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태
    const loginUser = useSelector((state) => state.loginReducer.user);

    useEffect(() => {
        axiosUtils.get("/users/lank").then((response) => {
            setUserList(response.data);
        });
    }, []);
    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = async () => {
        try {
            const response = await axiosUtils.get("/users/search", {
                params: {
                    keyword: searchKeyword,
                },
            });
            setUserList(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };
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
            <Container>Rank</Container>
            <UserListContainer>
                <SearchDiv>
                    <input
                        type="text"
                        placeholder="유저명을 입력하세요"
                        value={searchKeyword}
                        onChange={handleSearchChange}
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                </SearchDiv>
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
                            <StyledTr key={item.index} isSelf={loginUser.id === item.id}>
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
                            </StyledTr>
                        ))}
                    </tbody>
                </table>
            </UserListContainer>
        </>
    );
}
