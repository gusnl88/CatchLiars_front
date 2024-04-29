import React, { useState, useEffect } from "react";
import TimerStyle from "./Timer.style";

const Timer = ({ gameStarted, nextPlayer }) => {
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
                        nextPlayer(); // Game 컴포넌트의 nextPlayer 함수 호출
                        return 5;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted, nextPlayer]);

    return (
        <TimerStyle>
            <p>{remainTime}</p>
        </TimerStyle>
    );
};

export default Timer;
