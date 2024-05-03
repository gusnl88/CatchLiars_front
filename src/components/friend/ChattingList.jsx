import styled from "styled-components";
import axiosUtills from "../../utils/axiosUtils";
import { useEffect, useState } from "react";
import ChattingRoom from "./ChattingRoom";

const MainContainer = styled.div`
    width: 300px;
    height: 600px;
    position: absolute;
    background: #ffffff92;
    top: 100px;
    border-radius: 10px;
    .chatting_box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        h3 {
            margin: 10px;
        }
        .chatting_list {
            margin: 10px auto;
            display: flex;
            align-items: center;
        }
        
    }
`;

export default function FriendList() {
    const [chattingList, setChattingList] = useState([]);
    const [selectRoom, setSelectRoom] = useState(false);
    const [roomId,setRoomId]=useState("")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosUtills.get("/dms");
                console.log(res.data.dmInfo);
                setChattingList(res.data.dmInfo);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    const roomBtn=(roomId)=>{
        setRoomId(roomId)
        if(!selectRoom){
            setSelectRoom(true);
        }
    }
    return (
        <MainContainer>
            <div className="chatting_box">
                <h3>채팅방 리스트</h3>
                {chattingList.map((item, index) => (
                    <div className="chatting_list" key={index}>
                        <div>{item.counterInfo.id}</div>
                        <button onClick={()=>roomBtn(item.d_seq)}>채팅</button>
                    </div>
                ))}
                {selectRoom?<ChattingRoom roomId={roomId}/>:""}
            </div>
        </MainContainer>
    );
}
