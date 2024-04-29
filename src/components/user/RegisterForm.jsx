import React, { useState } from "react";
import LoginForm from "./LoginForm";
import axiosUtils from "../../utils/axiosUtils";
import axios from "axios";
import styled from "styled-components";

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; // 센터 정렬을 원한다면 추가
    justify-content: center; // 세로 방향으로 가운데 정렬을 원한다면 추가
    width: 100%; // 전체 너비 사용
    min-height: 100vh; // 뷰포트의 전체 높이 사용
`;

const Container = styled.div`
    width: 1000px;
    margin: 0 auto 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;

const SubTitle = styled.h2`
    font-size: 1.5em;
    color: #333;
    text-align: center; // 중앙 정렬
    margin-top: 20px;
    margin-bottom: 10px;
`;

const Text = styled.div`
    font-size: 1em;
    color: #666;
    line-height: 1.5;
    text-align: justify; // 양쪽 정렬
    margin: 0 20px; // 좌우 여백
`;
const IdContainer = styled.div`
    display: flex; // 이 줄을 추가하여 flexbox 레이아웃을 활용
    align-items: center; // 세로 중앙 정렬
    margin-bottom: 10px; // 요소 간 간격 추가
`;

const DivId = styled.div`
    width: 10%;
    padding: 8px;
    display: flex; // DivId 내부 요소도 flex로 정렬
    justify-content: flex-end; // 라벨을 오른쪽 정렬
`;

const Inputid = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px; // 라벨과 입력 필드 사이의 간격
`;

const CheckButton = styled.button`
    padding: 8px 10px; // Inputid와 동일한 패딩을 적용
    /* margin-top: 5px; */
    margin-left: 5px;
    cursor: pointer; // 버튼에 마우스 오버시 커서 변경
    background-color: #007bff; // 배경 색상 설정
    color: white; // 텍스트 색상 설정
    border: none;
    border-radius: 4px; // 테두리 둥글게 처리
`;
const PwContainer = styled.div`
    display: flex; // 이 줄을 추가하여 flexbox 레이아웃을 활용
    align-items: center; // 세로 중앙 정렬
    margin-bottom: 10px; // 요소 간 간격 추가
`;

const DivPw = styled.div`
    width: 10%;
    padding: 8px;
    display: flex; // DivId 내부 요소도 flex로 정렬
    justify-content: flex-end; // 라벨을 오른쪽 정렬
`;

const Inputpw = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px; // 라벨과 입력 필드 사이의 간격
`;
const Title = styled.h1`
    text-align: center;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 50px;
    padding-left: 40px;
`;

const NmContainer = styled.div`
    display: flex; // 이 줄을 추가하여 flexbox 레이아웃을 활용
    align-items: center; // 세로 중앙 정렬
    margin-bottom: 10px; // 요소 간 간격 추가
`;

const DivNm = styled.div`
    width: 10%;
    padding: 8px;
    display: flex; // DivId 내부 요소도 flex로 정렬
    justify-content: flex-end; // 라벨을 오른쪽 정렬
`;

const Inputnm = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px; // 라벨과 입력 필드 사이의 간격
`;

const EmContainer = styled.div`
    display: flex; // 이 줄을 추가하여 flexbox 레이아웃을 활용
    align-items: center; // 세로 중앙 정렬
    margin-bottom: 10px; // 요소 간 간격 추가
`;

const DivEm = styled.div`
    width: 10%;
    padding: 8px;
    display: flex; // DivId 내부 요소도 flex로 정렬
    justify-content: flex-end; // 라벨을 오른쪽 정렬
`;
const Inputem = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center; // 가로축 중앙 정렬
    align-items: center; // 세로축 중앙 정렬
    gap: 10px; // 버튼 사이의 간격
    margin-top: 20px; // 상단 여백
`;

const ErrorSpan = styled.span`
    color: red;
    margin: 5px;
`;

const Span = styled.span`
    margin: 5px;
`;

function RegisterForm() {
    const [formData, setFormData] = useState({
        id: "",
        pw: "",
        nickname: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [showRegister, setShowRegister] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [availabilityMessages, setAvailabilityMessages] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // ID 필드에 대한 검증 로직 추가
        if (e.target.name === "id") {
            const validChars = /^[a-zA-Z0-9]+$/; // 영어와 숫자만 허용
            if (!validChars.test(e.target.value) && e.target.value !== "") {
                setErrors({ ...errors, [e.target.name]: "ID는 영어와 숫자만 입력 가능합니다." });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [e.target.name]: <ErrorSpan>ID는 영어와 숫자만 입력 가능합니다.</ErrorSpan>,
                });
                return; // 유효하지 않은 문자가 포함된 경우 업데이트하지 않음
            }
            if (e.target.value.length < 5) {
                setErrors({ ...errors, [e.target.name]: "5글자 이상 입력해주세요" });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [e.target.name]: <ErrorSpan>5글자 이상 입력해주세요</ErrorSpan>,
                });
            } else {
                setErrors({ ...errors, [e.target.name]: "" });
                setAvailabilityMessages({ ...availabilityMessages, [e.target.name]: "" });
            }
        }

        // setErrors({ ...errors, [e.target.name]: "" });
        if (e.target.name === "pw") {
            if (e.target.value.length < 5) {
                setErrors({ ...errors, [e.target.name]: "5글자 이상 입력해주세요" });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [e.target.name]: <ErrorSpan>5글자 이상 입력해주세요</ErrorSpan>,
                });
            } else {
                setErrors({ ...errors, [e.target.name]: "" });
                setAvailabilityMessages({ ...availabilityMessages, [e.target.name]: "" });
            }
        }
    };

    const handleBack = () => {
        setShowRegister(false); // 뒤로 가기 버튼 클릭시 LoginForm 표시
    };

    const checkDuplicate = async (field) => {
        if (!formData[field]) {
            setErrors({ ...errors, [field]: "This field cannot be empty." });
            setAvailabilityMessages({ ...availabilityMessages, [field]: "" }); // 메시지 초기화
            return;
        }
        try {
            const response = await axiosUtils.post(`/users/check-duplicate`, {
                field: field,
                value: formData[field],
            });
            if (response.data === false) {
                setErrors({ ...errors, [field]: "이미 사용중 입니다." });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [field]: <ErrorSpan>이미 사용중입니다.</ErrorSpan>,
                }); // 메시지 초기화
            } else {
                setErrors({ ...errors, [field]: "" }); // 에러 메시지 초기화
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [field]: <Span>사용 가능합니다.</Span>,
                }); // 성공 메시지 설정
            }
        } catch (error) {
            console.error("Failed to check duplicate:", error);
            setErrors({ ...errors, [field]: "Failed to check. Please try again." });
            setAvailabilityMessages({ ...availabilityMessages, [field]: "" }); // 메시지 초기화
        }
    };

    if (!showRegister) {
        return <LoginForm />; // 뒤로가기 버튼
    }

    if (isRegistered) {
        return <LoginForm />; // 회원가입 성공 시 로그인 컴포넌트로 전환
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check for any existing errors or duplicates before submitting
        if (Object.values(errors).some((error) => error)) {
            console.log(Object.values(errors));
            console.log(Object.values(errors).some((error) => error));
            alert("Please resolve the errors before submitting.");
            return;
        }

        try {
            const response = await axiosUtils.post(
                // `${process.env.REACT_APP_API_SERVER}/users/signup`,
                `/users/signup`,
                formData
            );
            if (response.data === true) {
                alert("회원가입이 성공적으로 완료 되었습니다.");
                setIsRegistered(true);
            } else if (response.data.errors) {
                // setErrors(response.data.errors);
            } else {
                setServerError("오류가 발생했습니다. 다시 실행해주세요.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setServerError("서버 에러 발생");
        }
    };
    return (
        <MainContainer>
            <Container>
                <Title>회원가입을 위한 절차</Title>
                <SubTitle>회원가입 주의사항</SubTitle>
                <Text>
                    <div>회원가입 시 다음 사항을 유의해 주세요:</div>
                    <ul>
                        <li>모든 입력 필드는 반드시 작성해야 합니다.</li>
                        <li>이메일 주소는 회원가입 확인 및 비밀번호 재설정에 사용됩니다.</li>
                        <li>닉네임은 다른 사용자와 중복될 수 없습니다.</li>
                        <li>
                            아이디와 비밀번호는 5글자 이상 입력해주세요. 또한 아이디는 12글자 이하,
                            비밀번호는 10글자 이하로 설정해주세요.{" "}
                        </li>
                        <li>닉네임은 3글자 이상 입력해주세요.</li>
                        <li>이메일은 형식을 지켜서 작성해주시기 바립니다.</li>
                    </ul>
                </Text>
            </Container>
            <Container>
                <Title>회원가입</Title>
                <form onSubmit={handleSubmit}>
                    <IdContainer>
                        <DivId>
                            <label htmlFor="id">ID:</label>
                        </DivId>
                        <Inputid
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            maxLength={12}
                        />
                        <CheckButton type="button" onClick={() => checkDuplicate("id")}>
                            Check ID
                        </CheckButton>
                        <span>{availabilityMessages.id}</span>
                    </IdContainer>
                    <PwContainer>
                        <DivPw>
                            <label htmlFor="pw">Password:</label>
                        </DivPw>
                        <Inputpw
                            type="password"
                            id="pw"
                            name="pw"
                            value={formData.pw}
                            onChange={handleChange}
                            required
                            maxLength={10}
                        />
                        <span>{availabilityMessages.pw}</span>
                    </PwContainer>
                    <NmContainer>
                        <DivNm>
                            <label htmlFor="nickname">Nickname:</label>
                        </DivNm>
                        <Inputnm
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            required
                        />
                        <CheckButton type="button" onClick={() => checkDuplicate("nickname")}>
                            Check nickname
                        </CheckButton>
                        <span>{availabilityMessages.nickname}</span>
                    </NmContainer>
                    <EmContainer>
                        <DivEm>
                            <label htmlFor="email">Email:</label>
                        </DivEm>
                        <Inputem
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <CheckButton type="button" onClick={() => checkDuplicate("email")}>
                            Check Email
                        </CheckButton>
                        <span>{availabilityMessages.email}</span>
                    </EmContainer>
                    <ButtonContainer>
                        <CheckButton type="submit">Sign Up</CheckButton>
                        <CheckButton type="button" onClick={handleBack}>
                            돌아가기
                        </CheckButton>
                    </ButtonContainer>
                </form>
            </Container>
        </MainContainer>
    );
}

export default RegisterForm;
