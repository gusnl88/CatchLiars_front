import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/modules/login"; // login 액션을 가져옵니다.
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        dispatch(login("devel", "dobong")); // 로그인 값전달
        navigate("/games");
    };

    return (
        <Mainpage>
            <div className="main_box">
                <div className="image_box">
                    <img
                        src="https://i.namu.wiki/i/ArUNQENRkTX5SjFpTZgBxJd2XoRhfTobswB6vn1aH72c5m2wOfvx4d_dsicMbtjw4Cgu3sc_NCZ4wNd9tGDQQOS96ySuF7m-WAXYgxovqUbN_U_-b-5TT1lXQV3oaNHYwCxehF7dOzDsXssc_1SLlA.webp"
                        alt=""
                    />
                </div>
                <div className="login_box">
                    <button onClick={handleLogin}>로그인</button>{" "}
                </div>
            </div>
        </Mainpage>
    );
}
