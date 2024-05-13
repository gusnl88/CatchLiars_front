import React, { useEffect } from "react";
import axios from "axios";

function SessionCheck() {
    useEffect(() => {
        const intervalId = setInterval(checkSession, 60000); // 1분마다 함수 실행

        // 언마운트될 때 clearInterval 함수를 사용하여 interval 해제
        return () => clearInterval(intervalId);
    }, []);

    // 서버에 세션 상태를 확인
    const checkSession = () => {
        axios.get(`${process.env.REACT_APP_API_SERVER}/users/check`, { withCredentials: true });
    };

    return <></>;
}

export default SessionCheck;
