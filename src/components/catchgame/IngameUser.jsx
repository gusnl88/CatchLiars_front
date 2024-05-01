import React, { useState, useEffect } from "react";
import "./styles/gameplayer.css";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:8089", {
    autoConnect: false,
});
export default function GameUser() {
    const initSocketConnect = () => {
        if (!socket.connected) socket.connect();
    };

    const [players, setPlayers] = useState([]);
    // const [socket, setSocket] = useState(null); // WebSocket 객체 추가
    const loginUser = useSelector((state) => state.loginReducer.user);
    // console.log(loginUser);
    useEffect(() => {
        initSocketConnect();

        // const socket = socketIOClient("http://localhost:8089");
        // setSocket(socket);

        socket.on("gameId", (data) => {
            console.log(data);
        });

        socket.emit("loginUser", loginUser);
        // socket.on("errorMsg", (msg) => {
        //     alert(msg);
        // });
        socket.on("errorMsg", (msg) => {
            alert(msg);
        });
        socket.on("updateUserId", (players) => {
            setPlayers(players);

            console.log(">>", players);
        });
    }, [players]);

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
                                <div className="playerNum">#{player.id}</div>
                                <div className="score">score: {player.score}</div>
                                <div className="sequence">1</div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="player">나가기</button>
            </div>
        </>
    );
}
