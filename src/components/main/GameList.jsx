import styled from "styled-components";
import { Link } from "react-router-dom";

const Main = styled.div`
    align-content: center;
    flex: 1;
    background-color: #00154b;

    .game_box {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;

        .game1,
        .game2 {
            width: 50%;
            max-width: 350px;
            margin-bottom: 20px;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            .game_image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 20px;
                transition: transform 0.6s, filter 0.6s;
            }
            &:hover .game_image,
            &:hover .game_image {
                transform: scale(1.1);
                filter: brightness(80%);
            }
            @media (max-width: 768px) {
                width: 70%;
            }
        }
    }

    .game_box img {
        width: 100%;
        height: auto;
        border-radius: 20px;
    }
`;

export default function GameList() {
    return (
        <Main>
            <div className="game_box">
                <div className="game1">
                    <Link to="/games/list/Mafia">
                        <img className="game_image" src="/images/mafia.jpg" alt="" />
                    </Link>
                </div>
                <div className="game2">
                    <Link to="/games/list/Catchliars">
                        <img className="game_image" src="/images/catch.jpg" alt="" />
                    </Link>
                </div>
            </div>
        </Main>
    );
}
