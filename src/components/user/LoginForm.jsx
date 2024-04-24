import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [formData, setFormData] = useState({
        inputId: "",
        inputPw: "",
    });
    const navigate = useNavigate();

    // 폼 입력값 변경 시 상태 업데이트
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 로그인 폼 제출 시 실행되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/users/signin`,
                formData
            );
            console.log("서버 응답:", response.data); // 응답 내용을 콘솔에 출력
            if (response.data.loginSuccess) {
                alert("로그인 성공!");
                // 로그인 성공 후 리다이렉트 또는 다른 작업 수행
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

    // 회원가입 페이지로 이동하는 함수
    const handleSignup = () => {
        navigate("/register");
    };

    return (
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
    );
}

export default LoginForm;
