import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/modules/login";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import axiosUtils from "../../utils/axiosUtils";
import styled, { css } from "styled-components";

const responsiveWidth = css`
    width: 100%;
    @media (max-width: 768px) {
        width: 70%;
    }
    @media (min-width: 1024px) {
        width: 1000px;
    }
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
`;

const Container1 = styled.div`
    margin: 0 auto 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    ${responsiveWidth}
`;
const Container2 = styled.div`
    margin: 0 auto 20px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;

    align-items: center;
    ${responsiveWidth}
`;

const SubTitle = styled.h2`
    font-size: 1.5em;
    color: #333;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 10px;
`;

const Text = styled.div`
    font-size: 1em;
    color: #666;
    line-height: 1.5;
    text-align: justify;
    margin: 0 20px;

    @media (max-width: 768px) {
        font-size: 0.8em;
    }

    @media (min-width: 1024px) {
        font-size: 1.2em;
    }
`;
const IdContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const DivId = styled.div`
    width: 50%;
    padding: 8px;
    display: flex;
    justify-content: flex-start;
`;

const Inputid = styled.input`
    width: 100%;
    padding: 8px;
    margin-left: 10px;
`;

const PwContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const DivPw = styled.div`
    width: 50%;
    padding: 8px;
    display: flex;
    justify-content: flex-start;
`;

const Inputpw = styled.input`
    width: 100%;
    padding: 8px;
    margin-left: 10px;
`;
const Title = styled.h1`
    text-align: center;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 50px;
    padding-left: 40px;
`;

const CheckButton = styled.button`
    padding: 8px 10px;

    margin-left: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
`;

function LoginForm() {
    const [formData, setFormData] = useState({
        // inputId: "12345",
        // inputPw: "12345",
        inputId: "",
        inputPw: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosUtils.post(`/users/signin`, formData);

            if (response.data) {
                setShowModal(true);
                dispatch(login(response.data.u_seq, response.data.id, response.data.nickname));

                axiosUtils.patch(`/users/stateTrue`, { withCredentials: true });
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
        setShowRegister(true);
    };

    const closeModalAndNavigate = () => {
        setShowModal(false);
    };

    if (showRegister) {
        return <RegisterForm />;
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
