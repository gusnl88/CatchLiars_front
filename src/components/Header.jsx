import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/modules/login";
import styled from "styled-components";
import axiosUtils from "../utils/axiosUtils";

const ProfileImage = styled.img`
    width: 150px; // 이미지 너비 설정
    height: 150px; // 이미지 높이 설정
    border-radius: 50%; // 원형으로 만들기
    margin-bottom: 20px; // 이미지 아래 마진 추가
    object-fit: cover; // 이미지 비율 유지하면서 요소에 꽉 차게 채우기
`;

const InfoDiv = styled.div`
    margin-left: 5rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start; // 요소들을 컨테이너의 시작점에 정렬
    justify-content: center;
    width: calc(100% - 140px); // 이미지 너비와 일정 간격을 제외한 너비 사용
    /* padding: 10px; */
    font-size: 20px;
`;

const Emptydiv = styled.div`
    display: flex;
    background-color: yellow;
    width: 20%;
`;
const Box = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 600px;
    /* margin: 50px auto; */
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #f9f9f9;
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    background-color: #00154b;
    color: white;
    font-size: 40px;
`;

const Input = styled.input`
    width: 30%;
    padding: 8px;
    margin-left: 10px; // 라벨과 입력 필드 사이의 간격
`;

const ClossButton = styled.div`
    width: 100%;
    background-color: #00154b;
    color: white;
    font-size: 15px;
    text-align: center; // 텍스트 가로 중앙 정렬
    display: flex; // Flexbox 레이아웃 사용
    justify-content: center; // 요소들을 가로 방향으로 중앙 정렬
    align-items: center; // 요소들을 세로 방향으로 중앙 정렬
    height: 50px;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 약간 투명한 검은 배경 */
    z-index: 1000; /* 다른 요소들보다 앞에 오도록 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
`;
const CheckButton = styled.button`
    padding: 7px 10px; // Inputid와 동일한 패딩을 적용
    margin-top: 3px;
    margin-left: 5px;
    cursor: pointer; // 버튼에 마우스 오버시 커서 변경
    background-color: #00154b; // 배경 색상 설정
    color: white; // 텍스트 색상 설정
    border: none;
    border-radius: 4px; // 테두리 둥글게 처리
`;

const ModalContent = styled.div`
    width: 1000px; // 너비 설정
    height: 500px; // 높이 설정
    background-color: white; // 배경색
    border-radius: 8px; // 모서리 둥글게
    padding: 20px; // 내부 여백
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // 그림자 효과
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const HeaderPage = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10%;
    .img_box {
        height: 100%;
        overflow: hidden; /* 부모 요소를 벗어나는 이미지를 숨깁니다. */
        img {
            height: 100%;
            object-fit: cover; /* 이미지를 부모 요소에 꽉 채웁니다. */
        }
    }
    .link_btn {
        display: flex;
        position: relative;
        font-size: 15px;
    }
    .link_btn a {
        color: black;
        text-decoration: none;
        margin: 10px 10px auto;
        &:hover {
            color: skyblue;
        }
    }
    .notis-container {
        top: 10px;
        position: relative;
        color: black;
        text-decoration: none;
    }
    .notis-box {
        z-index: 1;
        position: absolute;
        left: -160px;
        top: 50px;
        width: 320px;
        max-height: 200px;
        background-color: #ffffffaf;
        border-radius: 5px;
        padding: 20px;
        display: ${(props) => (props.shownotis === "true" ? "block" : "none")};
        overflow-y: auto;

        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
    }

    .notis-box ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .notis-box ul li {
        margin-bottom: 10px;
    }

    .notis-box::-webkit-scrollbar {
        width: 8px;
    }

    .notis-box::-webkit-scrollbar-thumb {
        background-color: #d3d3d3;
        border-radius: 4px;
    }

    .notis-box::-webkit-scrollbar-thumb:hover {
        background-color: #a0a0a0;
    }
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border: 1px solid black;
    }
`;

const InvitationItem = styled.li`
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; // 내용이 넘칠 경우 다음 줄로 이동

    div {
        display: flex;
        align-items: center;
    }
`;

const SaveButton = styled.button`
    padding: 10px 20px;
    background-color: #4caf50; // 진한 녹색
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: #45a049; // 호버 시 색상 변경
        transform: scale(1.05); // 호버 시 약간 확대
    }

    &:active {
        background-color: #397d3c; // 클릭 시 색상 변경
    }

    &:focus {
        outline: none; // 포커스 시 외곽선 제거
        box-shadow: 0 0 0 3px rgba(71, 164, 71, 0.5); // 포커스 시 그림자 효과
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;
const ErrorSpan = styled.span`
    color: red;
    margin: 5px;
`;

const Span = styled.span`
    margin: 5px;
`;

const Nbutton = styled.button`
    padding: 5px 10px; // 패딩 감소
    margin-left: 2px;
    font-size: 12px; // 글자 크기 증가
    font-weight: bold;
    color: white;
    background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-image: linear-gradient(to right, #2575fc 0%, #6a11cb 100%);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    &:active {
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
        transform: translateY(2px);
    }

    &:focus {
        box-shadow: 0 0 0 3px rgba(50, 50, 250, 0.5);
    }
`;
export default function Header() {
    const [invitations, setInvitations] = useState([]);
    const [nickname, setNickname] = useState([]);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [showNotis, setShowNotis] = useState(false);
    const [user, setUser] = useState({ id: "", nickname: "", score: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newNickname, setNewNickname] = useState(user.nickname);
    const notisRef = useRef();
    const [availabilityMessages, setAvailabilityMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isModalOpen) {
            axiosUtils
                .get(`/users/myPage`) // Update this URL based on your API
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [isModalOpen]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // 입력 필드에서 값이 제공되지 않은 경우 기존 값 사용
        const updatedNickname = newNickname.trim() !== "" ? newNickname : user.nickname;
        const updatedNewPassword = newPassword.trim(); // 비밀번호는 빈 값일 수 있으므로 별도 처리
        const updatedPassword = password.trim();

        try {
            const payload = {
                id: user.id,
                currentPassword: updatedPassword,
                newPassword: updatedNewPassword,
                nickname: updatedNickname,
            };

            // 서버 요청
            const response = await axiosUtils.patch("users/myPage", payload, {
                withCredentials: true,
            });

            if (response.data === true) {
                alert("프로필이 업데이트되었습니다.");
                setIsEditing(false); // Editing mode off
                setUser({ ...user, nickname: updatedNickname }); // Update local state
                setNewPassword(""); // 폼에서 비밀번호 필드 초기화
                setPassword("");
                setNewNickname(updatedNickname);
            } else {
                alert("업데이트 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("프로필 업데이트 중 에러가 발생했습니다.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notisRef.current && !notisRef.current.contains(event.target)) {
                setShowNotis(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        axiosUtils.patch(`/users/stateFalse`, { withCredentials: true });
        axiosUtils
            .get(`/users/logout`, {
                withCredentials: true,
            })
            .then(() => {
                dispatch(logout());
                setIsAuthenticated(false);

                // window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const checkDuplicate = async (field, value) => {
        if (!value) {
            setErrors({ ...errors, [field]: "This field cannot be empty." });
            setAvailabilityMessages({ ...availabilityMessages, [field]: "" });
            return;
        }
        try {
            const response = await axiosUtils.post(`/users/check-duplicate`, {
                field: field,
                value: value,
            });
            if (response.data === false) {
                setErrors({ ...errors, [field]: "이미 사용중입니다." });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [field]: <ErrorSpan>이미 사용중입니다.</ErrorSpan>,
                });
            } else {
                setErrors({ ...errors, [field]: "" });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [field]: <Span>사용 가능합니다.</Span>,
                });
            }
        } catch (error) {
            console.error("Failed to check duplicate:", error);
            setErrors({ ...errors, [field]: "Failed to check. Please try again." });
            setAvailabilityMessages({ ...availabilityMessages, [field]: "" });
        }
    };

    const toggleNotis = () => {
        setShowNotis(!showNotis);
    };
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsEditing(false); // Reset editing state
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const response = await axiosUtils.get(`/invites/list`); // 친구 초대만 조회
            // {invitationList: Array(1), nickname: Array(1)}
            console.log(response.data.invitationList);
            setInvitations(response.data.invitationList);
            setNickname(response.data.nickname);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching invitations:", err);
            setError("초대 목록을 불러오는 데 실패했습니다.");
            setLoading(false);
        }
    };

    const acceptInvitation = async (f_seq, i_seq) => {
        try {
            const response = await axiosUtils.post(`/invites/accept`, { f_seq, type: 0 });
            if (response.data) {
                alert("친구가 추가되었습니다.");
                deleteInvitation(i_seq); // 초대 수락 후 삭제
            }
        } catch (err) {
            alert("초대 수락에 실패했습니다.");
        }
    };

    const deleteInvitation = async (i_seq) => {
        try {
            console.log("i_seq", i_seq);
            const response = await axiosUtils.delete(`/invites`, { data: { i_seq } });
            console.log(response.data);
            if (response.data) {
                fetchInvitations(); // 초대 삭제 후 목록 다시 불러오기
            } else {
                alert("삭제 실패: 이미 처리된 초대일 수 있습니다.");
            }
        } catch (err) {
            alert("초대 삭제에 실패했습니다.");
        }
    };
    return (
        <HeaderPage shownotis={showNotis ? "true" : "false"}>
            <div className="img_box">
                <Link to="/">
                    <img src="/images/logo.png" alt="" />
                </Link>
            </div>
            <div className="link_btn">
                <Link to="/games">게임</Link>
                <Link to="/users/lank">유저 랭킹</Link>
                <div className="notis-container">
                    <div ref={notisRef}>
                        <Link onClick={toggleNotis}>알림</Link>
                        <div className="notis-box">
                            <ul>
                                {invitations.length > 0 ? (
                                    invitations.map((invite, index) => (
                                        <InvitationItem key={invite.i_seq}>
                                            {nickname[index]} 님이 친구 요청을 보냈습니다.
                                            <div>
                                                <Nbutton
                                                    onClick={() =>
                                                        acceptInvitation(invite.f_seq, invite.i_seq)
                                                    }
                                                >
                                                    수락
                                                </Nbutton>
                                                <Nbutton
                                                    onClick={() => deleteInvitation(invite.i_seq)}
                                                >
                                                    거절
                                                </Nbutton>
                                            </div>
                                        </InvitationItem>
                                    ))
                                ) : (
                                    <li>친구 초대가 없습니다.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="notis-container">
                    <Link onClick={toggleModal}>마이페이지</Link>
                    {isModalOpen && (
                        <ModalOverlay>
                            <ModalContent>
                                <Container>마이페이지</Container>
                                <Box>
                                    <Emptydiv></Emptydiv>
                                    <ProfileImage
                                        src="/images/userprofile.jpg"
                                        alt="Profile Image"
                                    />
                                    {!isEditing ? (
                                        <InfoDiv>
                                            <div>아이디: {user.id}</div>
                                            <div>닉네임: {user.nickname}</div>
                                            <div>이메일: {user.email}</div>
                                            <div>점수: {user.score}</div>
                                            <SaveButton onClick={startEditing}>수정하기</SaveButton>
                                        </InfoDiv>
                                    ) : (
                                        <InfoDiv>
                                            {" "}
                                            <form onSubmit={handleUpdateProfile}>
                                                <div>
                                                    {"아이디 :"}
                                                    <Input type="text" value={user.id} disabled />
                                                </div>
                                                <div>
                                                    {"닉네임 :"}
                                                    <Input
                                                        type="text"
                                                        placeholder="새 닉네임"
                                                        // value={newNickname}
                                                        onChange={(e) =>
                                                            setNewNickname(e.target.value)
                                                        }
                                                    />
                                                    <CheckButton
                                                        type="button"
                                                        onClick={() =>
                                                            checkDuplicate("nickname", newNickname)
                                                        }
                                                    >
                                                        Check
                                                    </CheckButton>
                                                    <span>{availabilityMessages.nickname}</span>
                                                </div>
                                                <div>
                                                    {"현재 비밀번호 :"}
                                                    <Input
                                                        type="password"
                                                        placeholder="현재 비밀번호"
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(e.target.value)
                                                        }
                                                        required
                                                        maxLength={10}
                                                    />
                                                    {/* <span>{availabilityMessages.pw}</span> */}
                                                </div>
                                                <div>
                                                    {"새 비밀번호  :"}
                                                    <Input
                                                        type="password"
                                                        placeholder="새 비밀번호"
                                                        value={newPassword}
                                                        name="pw"
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value); // newPassword 상태 업데이트
                                                            if (e.target.value.length < 5) {
                                                                setErrors({
                                                                    ...errors,
                                                                    [e.target.name]:
                                                                        "5글자 이상 입력해주세요",
                                                                });
                                                                setAvailabilityMessages({
                                                                    ...availabilityMessages,
                                                                    [e.target.name]: (
                                                                        <ErrorSpan>
                                                                            5글자 이상 입력해주세요
                                                                        </ErrorSpan>
                                                                    ),
                                                                });
                                                            } else {
                                                                setErrors({
                                                                    ...errors,
                                                                    [e.target.name]: "",
                                                                });
                                                                setAvailabilityMessages({
                                                                    ...availabilityMessages,
                                                                    [e.target.name]: "",
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <span>{availabilityMessages.pw}</span>
                                                </div>
                                                <SaveButton type="submit">저장하기</SaveButton>
                                            </form>
                                        </InfoDiv>
                                    )}
                                </Box>

                                <ClossButton onClick={toggleModal}>닫기</ClossButton>
                            </ModalContent>
                        </ModalOverlay>
                    )}
                </div>
                {isAuthenticated ? (
                    <Link onClick={handleLogout}>로그아웃</Link>
                ) : (
                    <Link to="/">로그인</Link> // 로그인 링크로 변경
                )}
            </div>
        </HeaderPage>
    );
}
