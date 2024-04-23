import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/modules/login";
import styled from "styled-components";

const HeaderPage = styled.header`
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .link_btn a {
        color: black;
        text-decoration: none;
        margin: 10px 10px auto;
        &:hover {
            color: skyblue;
        }
    }
`;
export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <HeaderPage>
            <div>
                <h2>Catch Liars</h2>
                <h5 style={{ color: "red", marginLeft: "30px" }}>mini games</h5>
            </div>
            <div className="link_btn">
                <Link to="/games">게임</Link>
                <Link to="/notifications">알림</Link>
                <Link to="/mypage">마이페이지</Link>
                <Link to="/" onClick={handleLogout}>
                    로그아웃
                </Link>
            </div>
        </HeaderPage>
    );
}
