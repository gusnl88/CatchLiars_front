import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    background-color: #00154b;
    color: white;
    font-size: 100px;
`;
export default function CatchLiars() {
    return (
        <>
            <Container>캐치라이어 게임</Container>
        </>
    );
}
