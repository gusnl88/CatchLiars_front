import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
    const [formData, setFormData] = useState({
        id: "",
        pw: "",
        nickname: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    console.log(process.env.REACT_APP_API_SERVER);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/users/signup`,
                formData
            );
            if (response.data === true) {
                // 회원가입 성공 시 처리
                alert("회원가입이 완료되었습니다.");
                // 혹은 다른 페이지로 리다이렉트 등
            } else if (response.data.errors) {
                setErrors(response.data.errors);
            } else {
                setServerError("서버 응답이 올바르지 않습니다."); // 서버 응답이 true도 아니고 errors도 아닌 경우
            }
        } catch (error) {
            setServerError("서버 오류가 발생했습니다."); // 서버 요청 자체가 실패한 경우
        }
    };

    return (
        <div>
            <h1>User Signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
                    />
                    {errors.id && <span>{errors.id.msg}</span>}
                </div>
                <div>
                    <label htmlFor="pw">Password:</label>
                    <input
                        type="password"
                        id="pw"
                        name="pw"
                        value={formData.pw}
                        onChange={handleChange}
                        required
                    />
                    {errors.pw && <span>{errors.pw.msg}</span>}
                </div>
                <div>
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                    {errors.nickname && <span>{errors.nickname.msg}</span>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span>{errors.email.msg}</span>}
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
            </form>
            {serverError && <p>{serverError}</p>}
        </div>
    );
}

export default RegisterForm;
