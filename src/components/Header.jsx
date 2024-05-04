import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/modules/login";
import styled from "styled-components";
import axiosUtils from "../utils/axiosUtils";
import FriendInvitationPage from "../pages/FriendInvitationPage";

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

const DeleteButton = styled.button`
    padding: 10px 20px;
    background-color: #f44336; // 빨간색
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s, transform 0.2s;

    &:hover {
        background-color: #d32f2f; // 호버 시 색상 변경
        transform: scale(1.05); // 호버 시 약간 확대
    }

    &:active {
        background-color: #b71c1c; // 클릭 시 색상 변경
    }

    &:focus {
        outline: none; // 포커스 시 외곽선 제거
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.5); // 포커스 시 그림자 효과
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

const InvitationCount = styled.span`
    color: red; // 텍스트 색상을 빨간색으로 설정
`;
export default function Header() {
    const [invitateCheck, setInvitateCheck] = useState(false);
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
    const [invitations, setInvitations] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(""); // 업로드된 이미지 URL을 상태로 관리

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axiosUtils.get("/invites/list");
                setInvitations(response.data.invitationList); // 초대 목록 상태 업데이트
            } catch (error) {
                console.error("Error fetching invitations:", error);
            }
        };

        fetchInvitations();
    }, []);

    const invitateBtn = () => {
        setShowNotis(!showNotis);
        setInvitateCheck(!invitateCheck);
        // setInvitateCheck ? setInvitateCheck(false) : setInvitateCheck(true);
        // if (invitateCheck) {
        //     setInvitateCheck(false);
        // }
    };

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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsEditing(false); // Reset editing state
    };

    const startEditing = () => {
        setIsEditing(true);
    };

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    // 서버로 이미지 파일을 전송하고 업데이트하는 함수
    const handleImageUpload = async () => {
        try {
            if (!selectedImage) {
                console.error("이미지를 선택하세요.");
                return;
            }

            const formData = new FormData();
            formData.append("id", user.id);
            formData.append("fileInput", selectedImage);

            await axiosUtils.patch("/users/mypage/image", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("프로필 이미지가 업데이트되었습니다.");
            // 프로필 이미지 업데이트 후 필요한 작업을 수행할 수 있습니다.
        } catch (error) {
            console.error("프로필 이미지 업데이트 실패:", error);
        }
    };

    const handleDeleteUser = async () => {
        const confirmed = window.confirm("정말로 회원을 탈퇴하시겠습니까?");
        if (confirmed) {
            const password = prompt("비밀번호를 입력하세요:");
            if (password) {
                try {
                    const userID = user.id; // 로그인된 사용자의 ID
                    const response = await axiosUtils.delete("/users/myPage", {
                        data: { id: userID, currentPassword: password }, // 로그인된 사용자의 ID를 요청 데이터에 포함
                    });
                    if (response.data === true) {
                        // 회원 탈퇴 성공
                        alert("회원 탈퇴가 완료되었습니다.");
                        dispatch(logout());
                        // 로그아웃 등의 추가 작업 수행
                    } else {
                        alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
                    }
                } catch (error) {
                    console.error("회원 탈퇴 실패:", error);
                    alert("회원 탈퇴 중 에러가 발생했습니다.");
                }
            } else {
                alert("비밀번호를 입력해야 회원 탈퇴가 가능합니다.");
            }
        }
    };

    return (
        <HeaderPage>
            <div className="img_box">
                <Link to="/">
                    <img src="/images/logo.png" alt="" />
                </Link>
            </div>
            <div className="link_btn">
                <Link to="/games">게임</Link>
                <Link to="/users/lank">유저 랭킹</Link>
                <div className="notis-container">
                    <div shownotis={showNotis ? "true" : "false"} ref={notisRef}>
                        <Link onClick={invitateBtn}>
                            알림{" "}
                            {invitations.length > 0 && (
                                <InvitationCount> ({invitations.length})</InvitationCount>
                            )}
                        </Link>
                        {invitateCheck ? <FriendInvitationPage /> : ""}
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
                                    {imageUrl ? (
                                        <ProfileImage src={imageUrl} alt="Profile Image" />
                                    ) : (
                                        <ProfileImage
                                            src="/images/userprofile.jpg"
                                            alt="Profile Image"
                                        />
                                    )}
                                    {!isEditing ? (
                                        <InfoDiv>
                                            <div>아이디: {user.id}</div>
                                            <div>닉네임: {user.nickname}</div>
                                            <div>이메일: {user.email}</div>
                                            <div>점수: {user.score}</div>
                                            <SaveButton onClick={startEditing}>수정하기</SaveButton>
                                            {isAuthenticated ? (
                                                <DeleteButton onClick={handleDeleteUser}>
                                                    회원 탈퇴
                                                </DeleteButton>
                                            ) : (
                                                <Link onClick={handleLogout}></Link> // 로그인 링크로 변경
                                            )}
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
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <button onClick={handleImageUpload}>
                                                    이미지 변경
                                                </button>
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
