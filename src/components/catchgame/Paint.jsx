import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eraserPng from "./images/eraser.png";
import pencilPng from "./images/pencil.png";
import socketIOClient from "socket.io-client";
import "./styles/style.css";
import "./styles/gameplayer.css";

function Canvas({ players, gameStarted, loginUser, room }) {
    const [ctx, setCtx] = useState(null);
    const [painting, setPainting] = useState(false);
    const [tool, setTool] = useState("auto");
    const [socket, setSocket] = useState(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // 현재 플레이어 인덱스 상태 추가
    const [currentGamePlayer, setCurrentGamePlayer] = useState(false);
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const rangeRef = useRef(null);
    const colorRef = useRef(null);
    const drawRef = useRef(null);
    const eraseRef = useRef(null);
    const playerRefs = useRef([]); // 플레이어 요소들을 저장할 배열 참조 추가
    const INITIAL_COLOR = "#000000";
    const CANVAS_WIDTH = 850;
    const CANVAS_HEIGHT = 458;
    const colors = ["black", "white", "red", "orange", "yellow", "green", "blue", "navy", "purple"];

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_API_SERVER);
        setSocket(socket);

        // 소켓 연결이 끊겼을 때 자동으로 disconnect 이벤트 핸들러 실행
        socket.on("disconnect", () => {
            // 방을 나가는 로직 수행
            socket.emit("leaveRoom", { g_seq: room.g_seq });
        });

        socket.on("drawing2", (data) => {
            drawLine(data);
            // console.log("receive data", data);
        });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        context.strokeStyle = "#2c2c2c";
        context.fillStyle = "white";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.strokeStyle = INITIAL_COLOR;
        context.fillStyle = INITIAL_COLOR;
        context.lineWidth = 5;
        drawRef.current.classList.add("active");

        setCtx(context);
        setTool(`url("${pencilPng}") 0 64,auto`);
    }, [ctx]);

    // 페이지를 벗어날 때 게임방을 나가는 함수
    const leaveRoom = () => {
        if (socket) {
            // type은 게임방 경로를 변경할 경우를 대비해서 사용할 데이터임(경로 고정일 경우 삭제 예정)
            socket.emit("leaveRoom", { g_seq: room.g_seq }); // 정상적으로 나가는 경우
            socket.close();
        }
        navigate(0);
    };

    // useEffect(() => {
    //     window.addEventListener("beforeunload", leaveRoom); // 페이지를 벗어날 때 leaveRoom 함수 호출

    //     return () => {
    //         window.removeEventListener("beforeunload", leaveRoom); // 페이지를 벗어날 때 이벤트 리스너 제거
    //     };
    // }, []);

    // 페이지를 벗어날 경우 disconnect 이벤트 트리거
    window.addEventListener("beforeunload", () => {
        if (socket) {
            socket.emit("leaveRoom", { g_seq: room.g_seq }); // 정상적으로 나가지 않는 경우
            socket.disconnect();
        }
    });

    useEffect(() => {
        if (!gameStarted) return;

        const paintingTimer = setInterval(() => {
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            setCurrentPlayerIndex(nextPlayerIndex);
        }, 6000);

        return () => clearInterval(paintingTimer);
    }, [gameStarted, players, currentPlayerIndex]);

    useEffect(() => {
        const currentPlayer = playerRefs.current[currentPlayerIndex];
        if (currentPlayer) {
            currentPlayer.style.border = "2px solid red";

            if (players.length > 0 && players[currentPlayerIndex].id === loginUser.id)
                setCurrentGamePlayer(true);
            else setCurrentGamePlayer(false);
            if (!gameStarted) currentPlayer.style.border = "";
        }

        return () => {
            if (currentPlayer) {
                setCurrentGamePlayer(false);
                currentPlayer.style.border = "";
            }
        };
    }, [currentPlayerIndex, gameStarted, players, loginUser]);

    // 그림그리기
    const drawLine = (data) => {
        // console.log("draw", ctx);
        if (!ctx) return;

        const { x, y, color, size, isDraw } = data;

        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        if (!isDraw) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    // const stopPainting = () => {
    //     setPainting(false);
    // };

    // const startPainting = () => {
    //     setPainting(true);
    // };

    // const onMouseMove = (event) => {
    //     if (!ctx) return;
    //     const x = event.nativeEvent.offsetX;
    //     const y = event.nativeEvent.offsetY;
    //     if (!painting) {
    //         ctx.beginPath();
    //         ctx.moveTo(x, y);
    //     } else {
    //         ctx.lineTo(x, y);
    //         ctx.stroke();
    //     }

    //     if (socket) {
    //         socket.emit("drawing", {
    //             x: x,
    //             y: y,
    //             color: ctx.strokeStyle,
    //             size: ctx.lineWidth,
    //             isDraw: painting,
    //         });
    //     }
    // };

    const onMouseDown = (event) => {
        if (!ctx || !gameStarted || !currentGamePlayer) return; // 현재 플레이어가 아니면 그림 그리기 시작하지 않음
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setPainting(true);

        if (socket) {
            socket.emit("drawing", {
                x: x,
                y: y,
                color: ctx.strokeStyle,
                size: ctx.lineWidth,
                isDraw: painting,
            });
            // console.log(ctx);
        }
    };

    const onMouseMove = (event) => {
        if (!ctx || !gameStarted || !painting || !currentGamePlayer) return; // 그림 그리기 중이거나 현재 플레이어가 아니면 그림 그리기 동작하지 않음
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
        if (socket) {
            socket.emit("drawing", {
                x: x,
                y: y,
                color: ctx.strokeStyle,
                size: ctx.lineWidth,
                isDraw: painting,
            });
            // console.log(ctx);
        }
    };

    const onMouseUp = (event) => {
        if (!ctx || !gameStarted || !currentGamePlayer) return; // 현재 플레이어가 아니면 그림 그리기 종료하지 않음
        ctx.closePath();
        setPainting(false);

        if (socket) {
            const x = event.nativeEvent.offsetX;
            const y = event.nativeEvent.offsetY;
            socket.emit("drawing", {
                x: x,
                y: y,
                color: ctx.strokeStyle,
                size: ctx.lineWidth,
                isDraw: painting,
            });
        }
    };

    const onMouseLeave = (event) => {
        if (!ctx || !gameStarted || !currentGamePlayer) return; // 현재 플레이어가 아니면 그림 그리기 중지하지 않음
        ctx.closePath();
        setPainting(false);

        if (socket) {
            const x = event.nativeEvent.offsetX;
            const y = event.nativeEvent.offsetY;
            socket.emit("drawing", {
                x: x,
                y: y,
                color: ctx.strokeStyle,
                size: ctx.lineWidth,
                isDraw: painting,
            });
        }
    };

    const handleColorClick = (color) => {
        if (!ctx) return;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    };

    const handleRangeChange = (event) => {
        if (!ctx) return;
        const size = event.target.value;
        ctx.lineWidth = size;
    };

    const handleNewClick = () => {
        const page = canvasRef.current.getContext("2d");
        page.fillStyle = "white";
        page.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setTool(`url("${pencilPng}") 0 64,auto`);
        ctx.strokeStyle = INITIAL_COLOR;
        ctx.fillStyle = INITIAL_COLOR;
        ctx.lineWidth = 5;
        rangeRef.current.value = 5;
        colorRef.current.style.display = "block";
        colorRef.current.style.display = "flex";
        drawRef.current.classList.add("active");
        eraseRef.current.classList.remove("active");
    };

    const handleEraseClick = () => {
        if (tool === `url("${eraserPng}") 0 64,auto`) {
            eraseRef.current.classList.remove("active");
            drawRef.current.classList.add("active");

            setTool(`url("${pencilPng}") 0 64,auto`);

            ctx.strokeStyle = INITIAL_COLOR;
            ctx.fillStyle = INITIAL_COLOR;
            ctx.lineWidth = 5;
            rangeRef.current.value = 5;
            colorRef.current.style.display = "block";
            colorRef.current.style.display = "flex";
        } else {
            eraseRef.current.classList.add("active");
            drawRef.current.classList.remove("active");

            setTool(`url("${eraserPng}") 0 64,auto`);
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
            ctx.lineWidth = 50;
            rangeRef.current.value = 50;
            colorRef.current.style.display = "none";
        }
    };

    const handleDrawClick = () => {
        drawRef.current.classList.add("active");
        eraseRef.current.classList.remove("active");

        if (tool === `url("${eraserPng}") 0 64,auto`) {
            setTool(`url("${pencilPng}") 0 64,auto`);
            ctx.strokeStyle = INITIAL_COLOR;
            ctx.fillStyle = INITIAL_COLOR;
            ctx.lineWidth = 5;
            rangeRef.current.value = 5;
            colorRef.current.style.display = "block";
            colorRef.current.style.display = "flex";
        }
    };

    const goBack = () => {
        window.history.back();
    };

    // console.log(loginUser);
    // console.log(players.id);
    // console.log(players);
    return (
        <>
            <div className="box">
                {ctx &&
                    players.length > 0 &&
                    players.map((player, index) => (
                        <div
                            className={`player `}
                            key={player.id}
                            ref={(el) => (playerRefs.current[index] = el)} // 플레이어 요소들을 배열에 저장
                        >
                            <div style={{ display: "flex" }}>
                                <div className="profileImage">
                                    <div className="Image">프로필 사진</div>
                                </div>
                                <div className="playerInfo">
                                    <div className="playerNum">#{player.nickName}</div>
                                    <div className="score">score: {player.score}</div>
                                    <div className="sequence">1</div>
                                </div>
                            </div>
                        </div>
                    ))}

                <button className="quit" onClick={leaveRoom}>
                    나가기
                </button>
            </div>
            <div>
                <div style={{ border: "1px solid black", cursor: tool }}>
                    <canvas
                        id="jsCanvas"
                        className="canvas"
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onMouseMove={onMouseMove}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                    />

                    <div className="controls">
                        <input
                            type="range"
                            ref={rangeRef}
                            id="jsRange"
                            min="0.1"
                            max="50.0"
                            defaultValue="5"
                            step="0.1"
                            onChange={handleRangeChange}
                        />

                        <div className="controls__btns button">
                            <button onClick={handleNewClick}>new</button>

                            <button id="Draw" onClick={handleDrawClick} ref={drawRef}>
                                draw
                            </button>

                            <button id="Erase" onClick={handleEraseClick} ref={eraseRef}>
                                Erase
                            </button>
                        </div>

                        <div className="controls__colors" id="jsColors" ref={colorRef}>
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="controls__color jsColor"
                                    style={{
                                        backgroundColor: color,
                                        boxShadow: "5px 5px 5px grey",
                                    }}
                                    onClick={() => handleColorClick(color)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Canvas;
