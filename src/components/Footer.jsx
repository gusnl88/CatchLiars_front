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

export default function Footer() {
    return (
        <Footers>
            <button>채팅</button>
            <button>친구목록</button>
        </Footers>
    );
}
