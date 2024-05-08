import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/modules/login";
import styled, { css } from "styled-components";
import axiosUtils from "../utils/axiosUtils";
import FriendInvitationPage from "../pages/FriendInvitationPage";

const responsiveModal = css`
    width: 100%; // 모바일 기본 너비
    max-width: 500px; // 최대 너비 제한
    @media (min-width: 768px) {
        // 태블릿 화면에서는
        max-width: 700px; // 너비를 700px로
    }
    @media (min-width: 1024px) {
        // 데스크탑에서는
        max-width: 1000px; // 1000px 너비 사용
    }
`;

const ProfileImage = styled.img`
    width: 150px; // 이미지 너비 설정
    height: 150px; // 이미지 높이 설정
    border-radius: 50%; // 원형으로 만들기
    margin-bottom: 20px; // 이미지 아래 마진 추가
    object-fit: cover; // 이미지 비율 유지하면서 요소에 꽉 차게 채우기

    @media (max-width: 768px) {
        width: 100px; // 작은 화면에서 이미지 크기 축소
        height: 100px;
        margin-bottom: 10px; // 작은 화면에서 이미지 마진 축소
    }
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

    @media (max-width: 768px) {
        padding: 6px 8px;
        font-size: 0.8em;
    }

    @media (min-width: 1024px) {
        padding: 10px 12px;
        font-size: 1em;
    }
`;

const ModalContent = styled.div`
    ${responsiveModal}

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
    @media (max-width: 768px) {
        .link_btn {
            font-size: 9px;
        }
    }
`;
const Label = styled.label`
    @media (max-width: 768px) {
        font-size: 0.8em;
    }

    @media (min-width: 1024px) {
        font-size: 1em;
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

    @media (max-width: 768px) {
        padding: 6px 8px;
        font-size: 0.8em;
    }

    @media (min-width: 1024px) {
        padding: 10px 12px;
        font-size: 1em;
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

    @media (max-width: 768px) {
        padding: 6px 8px;
        font-size: 0.8em;
    }

    @media (min-width: 1024px) {
        padding: 10px 12px;
        font-size: 1em;
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

const ButtonDiv = styled.div`
    display: flex;
    flex-direction: row; // 기본적으로 가로 배치
    justify-content: space-around; // 버튼 사이 공간을 균등하게 분배
    margin-top: 1rem;

    @media (max-width: 768px) {
        // 태블릿 및 모바일 화면에서

        align-items: center; // 센터 정렬로 버튼 정렬
    }
`;

const PasswordModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
`;

const PasswordModalContent = styled.div`
    width: 500px;
    height: 200px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex; // Flexbox 레이아웃 활성화
    flex-direction: column; // 요소들을 수직으로 정렬
    justify-content: center; // 내부 요소들을 수직 방향 중앙으로 정렬
    align-items: center; // 내부 요소들을 수평 방향 중앙으로 정렬
    border: 5px solid #00154b; // 테두리 추가
`;

const ModalBody = styled.div`
    width: 100%; // 바디의 너비를 모달과 동일하게 설정
    padding: 20px; // 내부 패딩
    display: flex; // Flexbox 레이아웃 활성화
    flex-direction: column; // 요소들을 수직으로 정렬
    justify-content: center; // 내부 요소들을 수직 방향 중앙으로 정렬
    align-items: center; // 내부 요소들을 수평 방향 중앙으로 정렬
`;

const ModalBody2 = styled.div`
    width: 100%; // 바디의 너비를 모달과 동일하게 설정
    padding: 20px; // 내부 패딩
    display: flex; // Flexbox 레이아웃 활성화
    /* flex-direction: column; // 요소들을 수직으로 정렬 */
    justify-content: center; // 내부 요소들을 수직 방향 중앙으로 정렬
    align-items: center; // 내부 요소들을 수평 방향 중앙으로 정렬
`;
export default function Header() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axiosUtils.get("/invites/list");
                setInvitations(response.data.invitationList); // 초대 목록 상태 업데이트
            } catch (error) {
                console.error("Error fetching invitations:", error);
            }
        };
        // 최초 마운트 시 초대 목록 가져오기
        fetchInvitations();
        // 30초 간격으로 초대 목록 갱신하기
        const intervalId = setInterval(fetchInvitations, 1000); // 30초마다 초대 목록 갱신

        // 컴포넌트 언마운트 시 인터벌 해제
        return () => clearInterval(intervalId);
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
                setUser({
                    ...user,
                    nickname: updatedNickname,
                    image: response.data.imageUrl || user.image,
                });
                setImageUrl(response.data.imageUrl || imageUrl);
                setUpdateMessage("프로필이 업데이트되었습니다.");
                setUpdateModalOpen(true);
                setIsEditing(false);
                setNewPassword("");
                setPassword("");
                setNewNickname(updatedNickname);
                setIsModalOpen(false);
            } else {
                setUpdateMessage("업데이트 실패: " + response.data.message);
                setUpdateModalOpen(true);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setUpdateMessage("프로필 업데이트 중 에러가 발생했습니다.");
            setUpdateModalOpen(true);
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

    const UpdateModal = () => (
        <PasswordModalOverlay onClick={() => setUpdateModalOpen(false)}>
            <PasswordModalContent onClick={(e) => e.stopPropagation()}>
                <ModalBody>
                    <p>{updateMessage}</p>
                    <button onClick={() => setUpdateModalOpen(false)}>확인</button>
                </ModalBody>
            </PasswordModalContent>
        </PasswordModalOverlay>
    );

    const handleLogout = () => {
        axiosUtils.patch(`/users/stateFalse`, { withCredentials: true });
        axiosUtils
            .get(`/users/logout`, {
                withCredentials: true,
            })
            .then(() => {
                dispatch(logout());
                setIsAuthenticated(false);

                window.location.href = "/";
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
        if (!isModalOpen) {
            // 모달을 다시 열 때 상태를 갱신하여 변경사항을 반영
        }
        setIsEditing(false); // Reset editing state
    };

    const startEditing = () => {
        setIsEditing(true); // 편집 모드를 활성화
        setIsPasswordModalOpen(false); // 비밀번호 확인 모달은 닫기
    };

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert("이미지를 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("fileInput", selectedImage);

        try {
            const response = await axiosUtils.patch(`/users/mypage/image`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                if (response.data.imageUrl) {
                    const newImageUrl = response.data.imageUrl; // 응답 구조에 따라 경로 조정 필요
                    console.log("새로운 이미지 URL:", newImageUrl);
                    setImageUrl(newImageUrl);
                    setUser({ ...user, image: newImageUrl });
                } else {
                }
            } else {
            }
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

    const togglePasswordModal = () => {
        setIsPasswordModalOpen(!isPasswordModalOpen);
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        const updatedPassword = password.trim();

        try {
            const payload = {
                id: user.id,
                currentPassword: updatedPassword,
            };

            // 서버에 비밀번호 확인 요청 보내기
            const response = await axiosUtils.patch("/users/myPage", payload, {
                withCredentials: true,
            });

            // 비밀번호 일치 확인
            if (response.status === 200) {
                startEditing(); // 비밀번호 일치 시 편집 모드 시작
            } else {
                throw new Error("비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            // 서버 응답에서 제공하는 오류 메시지를 통해 사용자에게 구체적 정보 제공
            const errorMessage = error.response?.data || "비밀번호 확인 중 문제가 발생했습니다.";
            alert(errorMessage);
            console.error("비밀번호 확인 중 에러 발생:", error);
        }
    };

    return (
        <HeaderPage>
            {updateModalOpen && <UpdateModal />}
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

                                    <ProfileImage
                                        src={`${process.env.REACT_APP_API_SERVER}/${user.image}`}
                                        alt="Profile Image"
                                    />

                                    {!isEditing ? (
                                        <InfoDiv>
                                            <Label>아이디: {user.id}</Label>
                                            <Label>닉네임: {user.nickname}</Label>
                                            <Label>이메일: {user.email}</Label>
                                            <Label>점수: {user.score}</Label>
                                            <ButtonDiv>
                                                <SaveButton onClick={togglePasswordModal}>
                                                    수정하기
                                                </SaveButton>
                                                {isPasswordModalOpen && (
                                                    <PasswordModalOverlay>
                                                        <PasswordModalContent>
                                                            <form onSubmit={handlePasswordSubmit}>
                                                                <Label htmlFor="password">
                                                                    현재 비밀번호:
                                                                </Label>
                                                                <input
                                                                    id="password"
                                                                    type="password"
                                                                    onChange={(e) =>
                                                                        setPassword(e.target.value)
                                                                    }
                                                                    required
                                                                />
                                                                <ModalBody2>
                                                                    <button type="submit">
                                                                        확인
                                                                    </button>
                                                                    <button
                                                                        onClick={
                                                                            togglePasswordModal
                                                                        }
                                                                    >
                                                                        취소
                                                                    </button>
                                                                </ModalBody2>
                                                            </form>
                                                        </PasswordModalContent>
                                                    </PasswordModalOverlay>
                                                )}
                                                {isAuthenticated ? (
                                                    <DeleteButton onClick={handleDeleteUser}>
                                                        회원탈퇴
                                                    </DeleteButton>
                                                ) : (
                                                    <Link onClick={handleLogout}></Link> // 로그인 링크로 변경
                                                )}
                                            </ButtonDiv>
                                        </InfoDiv>
                                    ) : (
                                        <InfoDiv>
                                            {" "}
                                            <form onSubmit={handleUpdateProfile}>
                                                <div>
                                                    <Label>아이디 :</Label>
                                                    <Input type="text" value={user.id} disabled />
                                                </div>
                                                <div>
                                                    <Label>닉네임 :</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder={user.nickname}
                                                        // value={user.nickname}
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
                                                    <Label>비밀번호 :</Label>
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
                                                <div>
                                                    <Label>프로필 이미지 수정 :</Label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>

                                                <div>
                                                    <SaveButton onClick={handleImageUpload}>
                                                        저장하기
                                                    </SaveButton>
                                                    {/* <SaveButton type="submit">저장하기</SaveButton> */}
                                                    <DeleteButton
                                                        onClick={() => setIsEditing(false)}
                                                    >
                                                        뒤로가기
                                                    </DeleteButton>
                                                </div>
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
