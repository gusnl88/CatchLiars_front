import React, { useState } from "react";
import styled from "styled-components";

// 여기서는 로그인 후 보여줄 컴포넌트를 임포트합니다.
import LoginForm from "../components/user/LoginForm";

const Mainpage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .main_box {
        height: 50vh;
        display: flex;
        text-align: center;
        flex-direction: column;
        justify-content: space-around;
        .image_box {
            max-width: 100%;
            max-height: 100%;
            flex: 8;
        }

        .image_box img {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
        }
        .login_box {
            flex: 2;
        }
        button {
            background-color: #4caf50;
            border: none;
            color: white;
            padding: 15px 32px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 10px;
        }
    }
`;

export default function LoginPage() {
    const [showLoginComponent, setShowLoginComponent] = useState(true);

    const handleLogin = () => {
        setShowLoginComponent(false); // 버튼 클릭시 컴포넌트 교체
    };

    return (
        <Mainpage>
            {showLoginComponent ? (
                <div className="main_box">
                    <div className="image_box">
                        <img src="/images/catch.jpg" alt="" />
                    </div>
                    <div className="login_box">
                        <button onClick={handleLogin}>로그인</button>
                    </div>
                </div>
            ) : (
                <LoginForm /> // 로그인 후 보여줄 컴포넌트
            )}
        </Mainpage>
    );
}
