import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/modules/login";
import RegisterForm from "./RegisterForm"; // 회원가입 폼 컴포넌트 임포트
import { useNavigate } from "react-router-dom";
import axiosUtils from "../../utils/axiosUtils";
import styled from "styled-components";

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; // 센터 정렬을 원한다면 추가
    justify-content: center; // 세로 방향으로 가운데 정렬을 원한다면 추가
    width: 100%; // 전체 너비 사용
    min-height: 100vh; // 뷰포트의 전체 높이 사용
`;

const Container1 = styled.div`
    width: 1000px;
    margin: 0 auto 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;
const Container2 = styled.div`
    width: 1000px;
    margin: 0 auto 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
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
    width: 50%;
    padding: 8px;
    display: flex; // DivId 내부 요소도 flex로 정렬
    justify-content: flex-start; // 라벨을 오른쪽 정렬
`;

const Inputid = styled.input`
    width: 100%;
    padding: 8px;
    margin-left: 10px; // 라벨과 입력 필드 사이의 간격
`;

const PwContainer = styled.div`
    display: flex; // 이 줄을 추가하여 flexbox 레이아웃을 활용
    align-items: center; // 세로 중앙 정렬
    margin-bottom: 10px; // 요소 간 간격 추가
`;

const DivPw = styled.div`
    width: 50%;
    padding: 8px;
    display: flex; // DivId 내부 요소도 flex로 정렬
    justify-content: flex-start; // 라벨을 오른쪽 정렬
`;

const Inputpw = styled.input`
    width: 100%;
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

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center; // 가로축 중앙 정렬
    align-items: center; // 세로축 중앙 정렬
    gap: 10px; // 버튼 사이의 간격
    margin-top: 20px; // 상단 여백
`;

function LoginForm() {
    const [formData, setFormData] = useState({
        inputId: "",
        inputPw: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [showRegister, setShowRegister] = useState(false); // 회원가입 폼 보여줄지 결정하는 상태
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosUtils.post(
                `/users/signin`,
                formData
                // { withCredentials: true }
            );
            if (response.data) {
                setShowModal(true);
                dispatch(login(formData.inputId, formData.inputPw));
            } else {
                const errorMessage = response.data.message
                    ? response.data.message.message
                    : "로그인 실패";
                alert(errorMessage);
            }
        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 오류가 발생했습니다. 자세한 내용은 콘솔을 확인해주세요.");
        }
    };

    const handleSignup = () => {
        setShowRegister(true); // 회원가입 폼을 보여주는 상태를 true로 설정
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
        // navigate("/GameWaitingList");
    };

    if (showRegister) {
        return <RegisterForm />; // 회원가입 컴포넌트 렌더링
    }

    return (
        <MainContainer>
            <Container1>
                <Title>로그인을 위한 절차</Title>
                <SubTitle>로그인 주의사항</SubTitle>
                <Text>
                    <div>로그인 시 다음 사항을 유의해 주세요:</div>
                    <ul>
                        <li>모든 입력 필드는 반드시 작성해야 합니다.</li>
                        <li>아이디와 비밀번호는 5글자 이상 입력해주세요.</li>
                        <li>처음 이용하시는 분은 아래 회원가입을 통해 진행해주세요.</li>
                    </ul>
                </Text>
            </Container1>
            <Container2>
                <form onSubmit={handleSubmit}>
                    <Title>로그인</Title>
                    <IdContainer>
                        <DivId>
                            <label>아이디:</label>
                        </DivId>
                        <Inputid
                            type="text"
                            name="inputId"
                            value={formData.inputId}
                            onChange={handleChange}
                            required
                        />
                    </IdContainer>
                    <PwContainer>
                        <DivPw>
                            <label>비밀번호:</label>
                        </DivPw>
                        <Inputpw
                            type="password"
                            name="inputPw"
                            value={formData.inputPw}
                            onChange={handleChange}
                            required
                        />
                    </PwContainer>
                    <ButtonContainer>
                        <CheckButton type="submit">로그인</CheckButton>
                        <CheckButton type="button" onClick={handleSignup}>
                            회원가입
                        </CheckButton>
                    </ButtonContainer>
                </form>

                {showModal && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            padding: "20px",
                            zIndex: 1000,
                        }}
                    >
                        <p>로그인 성공!</p>
                        <button onClick={closeModalAndNavigate}>확인</button>
                    </div>
                )}
            </Container2>
        </MainContainer>
    );
}

export default LoginForm;
