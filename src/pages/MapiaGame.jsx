import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    flex: 1;
    background-color: #00154b;
    color: white;
    font-size: 100px;
`;
export default function MapiaGame() {
    return (
        <>
            <Container>마피아게임</Container>
        </>
    );
}
