import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TimerStyle = styled.div`
    display: flex;
    background-image: url("/images/clock.gif");
    background-size: cover;
    background-repeat: no-repeat;
    width: 3rem;
    height: 3rem;
    justify-content: center;
    align-items: center;
`;

const Timer = ({ gameStarted, nextPlayer, currentPlayer }) => {
    const [remainTime, setRemainTime] = useState(5);

    useEffect(() => {
        let timer;
        if (gameStarted) {
            timer = setInterval(() => {
                setRemainTime((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timer);
                        nextPlayer(); // 다음 플레이어로 이동
                        return 5;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted, nextPlayer]);

    useEffect(() => {
        if (currentPlayer === 6) {
            // currentPlayer가 6이 되면서 한 번만 실행됨
            setRemainTime(5); // remainTime 초기화
        }
    }, [currentPlayer]);

    return (
        <TimerStyle>
            <p>{remainTime}</p>
        </TimerStyle>
    );
};

export default Timer;
