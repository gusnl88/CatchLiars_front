import GameList from "../components/main/GameList";
import styled from "styled-components";

const Mainpage = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;
export default function MainPage() {
    return (
        <Mainpage>
            <GameList />
        </Mainpage>
    );
}
