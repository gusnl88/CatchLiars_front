import React, { useEffect } from "react";
import axios from "axios";

function SessionCheck() {
    useEffect(() => {
        const intervalId = setInterval(checkSession, 60000); // 1분마다 함수 실행


        return () => clearInterval(intervalId);
    }, []);

    const checkSession = () => {
        axios.get(`${process.env.REACT_APP_API_SERVER}/users/check`, { withCredentials: true });
    };

    return <></>;
}

export default SessionCheck;
