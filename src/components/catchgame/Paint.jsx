import React, { useState, useRef, useEffect } from "react";
import eraserPng from "./images/eraser.png";
import pencilPng from "./images/pencil.png";
import socketIOClient from "socket.io-client";
import "./styles/style.css";

function Canvas() {
    const [ctx, setCtx] = useState(null);
    const [painting, setPainting] = useState(false);
    const [tool, setTool] = useState("auto");
    const [socket, setSocket] = useState(null); // WebSocket 객체 추가
    const [users, setUsers] = useState([]); // 유저 정보 추가
    const [currentUserIndex, setCurrentUserIndex] = useState(0); // 현재 유저 인덱스 추가
    const [drawingTimeLeft, setDrawingTimeLeft] = useState(5); // 그림을 그릴 수 있는 시간 추가

    const canvasRef = useRef(null);
    const rangeRef = useRef(null);
    const colorRef = useRef(null);
    const drawRef = useRef(null);
    const eraseRef = useRef(null);

    // 초기 색과 캔버스 크기
    const INITIAL_COLOR = "#000000";
    const CANVAS_WIDTH = 700;
    const CANVAS_HEIGHT = 600;

    // 컬러 목록
    const colors = ["black", "white", "red", "orange", "yellow", "green", "blue", "navy", "purple"];

    useEffect(() => {
        // 웹 소켓 연결
        const socket = socketIOClient("http://localhost:8080");
        setSocket(socket);

        socket.on("drawing", (data) => {
            // console.log("Received drawing data:", data);
            drawLine(data); // 받은 데이터로 선을 그림
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

        // console.log(context);

        setCtx(context);
        setTool(`url("${pencilPng}") 0 64,auto`);

        // 유저 정보 초기화
        const initialUsers = [
            { id: 1, name: "Player 1" },
            { id: 2, name: "Player 2" },
            // 나머지 유저 정보 추가
        ];
        setUsers(initialUsers);
    }, [ctx]);

    // 타이머 로직
    useEffect(() => {
        let timer;
        if (drawingTimeLeft > 0) {
            timer = setTimeout(() => {
                setDrawingTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            // console.log(drawingTimeLeft);
        } else {
            // 그리기 시간이 끝날 때 처리
            setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
            setDrawingTimeLeft(5); // 다음 사용자를 위해 그리기 시간 초기화
        }

        return () => clearTimeout(timer);
    }, [drawingTimeLeft, setCurrentUserIndex, users.length]);

    const drawLine = (data) => {
        // console.log(ctx);
        if (!ctx) return; // ctx가 null이면 함수를 빠르게 종료

        // console.log(data);
        const { x, y, color, size, isDraw } = data;

        // console.log(isDraw);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        if (!isDraw) {
            // 마우스가 움직이기만 할 때
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            // 마우스가 클릭되고 있을 때
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // ctx.beginPath();
        // ctx.moveTo(x0, y0);
        // ctx.lineTo(x1, y1);

        // ctx.stroke();
        // console.log(color);
    };

    // 마우스가 떼질 때
    const stopPainting = () => {
        setPainting(false);
    };

    // 마우스 클릭될 때
    const startPainting = () => {
        setPainting(true);
    };

    // 마우스가 움직일 때
    const onMouseMove = (event) => {
        if (!ctx) return; // ctx가 null인 경우
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        if (!painting) {
            // 마우스가 움직이기만 할 때
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            // 마우스가 클릭되고 있을 때
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // 그림 데이터를 서버로 전송
        if (socket) {
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
        if (!ctx) return; // ctx가 null인 경우
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    };

    const handleRangeChange = (event) => {
        if (!ctx) return; // ctx가 null인 경우
        const size = event.target.value;
        ctx.lineWidth = size;
    };

    const handleNewClick = () => {
        const page = canvasRef.current.getContext("2d");
        page.fillStyle = "white";
        page.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setTool(`url("${pencilPng}") 0 64,auto`);
        ctx.strokeStyle = INITIAL_COLOR; // 선의 색상을 초기 색상으로 설정
        ctx.fillStyle = INITIAL_COLOR; // 채우기 색상도 초기 색상으로 설정
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

            ctx.strokeStyle = INITIAL_COLOR; // 선의 색상을 초기 색상으로 설정
            ctx.fillStyle = INITIAL_COLOR; // 채우기 색상도 초기 색상으로 설정
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
        // setTool(`url("${pencilPng}") 0 64,auto`);

        if (tool === `url("${eraserPng}") 0 64,auto`) {
            setTool(`url("${pencilPng}") 0 64,auto`);
            ctx.strokeStyle = INITIAL_COLOR; // 선의 색상을 초기 색상으로 설정
            ctx.fillStyle = INITIAL_COLOR; // 채우기 색상도 초기 색상으로 설정
            ctx.lineWidth = 5;
            rangeRef.current.value = 5;
            colorRef.current.style.display = "block";
            colorRef.current.style.display = "flex";
        }
    };

    return (
        <>
            <div style={{ border: "1px solid black", cursor: tool }}>
                {/* Canvas 요소를 렌더링 */}
                <canvas
                    id="jsCanvas"
                    className="canvas"
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    /* 마우스가 움직일 때 */
                    onMouseMove={onMouseMove}
                    onMouseDown={startPainting}
                    onMouseUp={stopPainting}
                    onMouseLeave={stopPainting}
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
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorClick(color)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Canvas;
