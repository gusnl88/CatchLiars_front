import React, { useState } from "react";
import LoginForm from "./LoginForm";
import axiosUtils from "../../utils/axiosUtils";
import styled, { css } from "styled-components";

const responsiveContainer = css`
    width: 100%;
    @media (max-width: 768px) {
        width: 80%;
    }
    @media (min-width: 1024px) {
        width: 1000px;
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
const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
`;

const Container = styled.div`
    ${responsiveContainer}
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
        font-size: 0.4em;
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
    width: 10%;
    padding: 8px;
    display: flex;
    justify-content: flex-end;
`;

const Inputid = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px;
`;

const CheckButton = styled.button`
    padding: 8px 10px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;

    @media (max-width: 768px) {
        padding: 6px 8px;
        font-size: 0.8em;
    }

    @media (min-width: 1024px) {
        padding: 10px 12px;
        font-size: 1em;
    }
`;
const PwContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const DivPw = styled.div`
    width: 10%;
    padding: 8px;
    display: flex;
    justify-content: flex-end;
`;

const Inputpw = styled.input`
    width: 50%;
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

const NmContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const DivNm = styled.div`
    width: 10%;
    padding: 8px;
    display: flex;
    justify-content: flex-end;
`;

const Inputnm = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px;
`;

const EmContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const DivEm = styled.div`
    width: 10%;
    padding: 8px;
    display: flex;
    justify-content: flex-end;
`;
const Inputem = styled.input`
    width: 50%;
    padding: 8px;
    margin-left: 10px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availabilityMessages, setAvailabilityMessages] = useState({});
    const [validations, setValidations] = useState({
        id: null,
        nickname: null,
        email: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "id") {
            const validChars = /^[a-zA-Z0-9]+$/;
            if (!validChars.test(e.target.value) && e.target.value !== "") {
                setErrors({ ...errors, [e.target.name]: "ID는 영어와 숫자만 입력 가능합니다." });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [e.target.name]: <ErrorSpan>ID는 영어와 숫자만 입력 가능합니다.</ErrorSpan>,
                });
                return;
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
        setShowRegister(false);
    };

    const checkDuplicate = async (field) => {
        if (!formData[field]) {
            setErrors({ ...errors, [field]: "This field cannot be empty." });
            setAvailabilityMessages({ ...availabilityMessages, [field]: "" });
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
                });
                setValidations({ ...validations, [field]: false });
            } else {
                setErrors({ ...errors, [field]: "" });
                setAvailabilityMessages({
                    ...availabilityMessages,
                    [field]: <Span>사용 가능합니다.</Span>,
                });
                setValidations({ ...validations, [field]: true });
            }
        } catch (error) {
            console.error("Failed to check duplicate:", error);
            setErrors({ ...errors, [field]: "Failed to check. Please try again." });
            setAvailabilityMessages({ ...availabilityMessages, [field]: "" });
        }
    };

    if (!showRegister) {
        return <LoginForm />;
    }

    if (isRegistered) {
        return <LoginForm />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error)) {
            console.log(Object.values(errors));
            console.log(Object.values(errors).some((error) => error));
            alert("Please resolve the errors before submitting.");
            return;
        }

        if (
            Object.values(validations).includes(null) ||
            Object.values(validations).includes(false)
        ) {
            alert("제출 전 모든 유효성 검사를 진행해주세요");
            return;
        }

        try {
            const response = await axiosUtils.post(`/users/signup`, formData);
            if (response.data === true) {
                alert("회원가입이 성공적으로 완료 되었습니다.");
                setIsRegistered(true);
            } else if (response.data.errors) {
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
                            <Label htmlFor="id">ID:</Label>
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
                            Check
                        </CheckButton>
                        <span>{availabilityMessages.id}</span>
                    </IdContainer>
                    <PwContainer>
                        <DivPw>
                            <Label htmlFor="pw">Password:</Label>
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
                            <Label htmlFor="nickname">Nickname:</Label>
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
                            Check
                        </CheckButton>
                        <span>{availabilityMessages.nickname}</span>
                    </NmContainer>
                    <EmContainer>
                        <DivEm>
                            <Label htmlFor="email">Email:</Label>
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
                            Check
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
