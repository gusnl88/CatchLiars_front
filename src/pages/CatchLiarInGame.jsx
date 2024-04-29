// import Chatting3 from "./components/Chatting3";
// import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/catchgame/Header";
import Canvas from "../components/catchgame/Paint";
import GameUser from "../components/catchgame/IngameUser";

function CatchLiarInGame() {
    return (
        <>
            <Header />
            <div style={{ display: "flex" }}>
                <GameUser></GameUser>
                <Canvas></Canvas>
                {/* <Chatting3></Chatting3> */}
            </div>
        </>
    );
}

export default CatchLiarInGame;
