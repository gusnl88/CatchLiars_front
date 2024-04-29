import React, { useState, useEffect } from "react";
import "./styles/gameplayer.css";

export default function GameUser() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // 서버로부터 플레이어 정보를 받아오는 함수
        const fetchPlayers = () => {
            // 서버에서 플레이어 정보를 받아오는 작업 수행
            // 받아온 정보를 players 상태에 설정
            const newPlayers = [
                { id: 1, name: "Player 1", score: 100, sequence: "제 차례입니다!" },
                {
                    id: 2,
                    name: "Player 2",
                    score: 100,
                    sequence: "그리는 순서가 1 차례 남았습니다!",
                },
                // 추가적인 플레이어 정보가 있다면 여기에 추가
            ];
            setPlayers(newPlayers);
        };

        // fetchPlayers 함수 호출
        fetchPlayers();

        // 여기에 소켓 통신 등을 사용하여 플레이어 정보를 업데이트하는 코드 작성
    }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

    return (
        <>
            <div className="box">
                {players.map((player) => (
                    <div className="player" key={player.id}>
                        <div style={{ display: "flex" }}>
                            <div className="profileImage">
                                <div className="Image">프로필 사진</div>
                            </div>
                            <div className="playerInfo">
                                <div className="playerNum">#{player.name}</div>
                                <div className="score">score: {player.score}</div>
                                <div className="sequence">{player.sequence}</div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="player">나가기</button>
            </div>
        </>
    );
}
