import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.footer`
    display: flex;
    justify-content: end;
    background-color: #00154b;
    height: 5%;
    button {
        background-color: #00154b;
        color: white;
        font-size: 20px;
        font-weight: bold;
        border: none;
        margin: 10px;
        cursor: pointer;
        &:hover {
            color: skyblue;
        }
    }
`;

const StyledLink = styled(Link)`
    padding: 10px 15px;
    margin: 5px;

    color: white; /* 텍스트 색상 */
    text-decoration: none; /* 밑줄 없앰 */
    border-radius: 5px; /* 테두리 둥글게 */
`;

export default function Footer() {
    return (
        <Footers>
            <StyledLink>채팅</StyledLink>
            <StyledLink to="/users/friends">친구목록</StyledLink>
            <StyledLink to="/users/friends/accept">초대</StyledLink>
        </Footers>
    );
}
