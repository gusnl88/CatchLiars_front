import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store/modules/login";
import RegisterForm from "./RegisterForm"; // 회원가입 폼 컴포넌트 임포트
import { useNavigate } from "react-router-dom";

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
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/users/signin`,
                formData,
                { withCredentials: true }
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
        <div>
            <form onSubmit={handleSubmit}>
                <h2>로그인</h2>
                <div>
                    <label>아이디:</label>
                    <input
                        type="text"
                        name="inputId"
                        value={formData.inputId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        name="inputPw"
                        value={formData.inputPw}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">로그인</button>
                <button type="button" onClick={handleSignup}>
                    회원가입
                </button>
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
        </div>
    );
}

export default LoginForm;
