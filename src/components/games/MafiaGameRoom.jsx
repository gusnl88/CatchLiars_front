import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosUtils from '../../utils/axiosUtils'

const RoomContainer = styled.div`
    background-color: white;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    color: black;
    display: flex;
    justify-content: space-around;
    .side_zone {
        width: 20%;
        height: 100%;
        .side_box {
            display: flex;
            height: 100%;
            flex-direction: column;
            .user_box {
                height: 80%;
                .user_profile {
                    height: 25%;
                    width: 100%;
                    .profile_box {
                        padding: 5px;
                        height: 100%;
                    }
                    img {
                        border-radius: 10px;
                        height: 80%;
                        width: 100%;
                    }
                }
            }
            .event_zone {
                height: 20%;
                display: flex;
                justify-content: center;
                align-items: center;
                .btn_box {
                }
            }
        }
    }
    .play_zone {
        width: 60%;
        .title_box {
            height: 10%;
            display: flex;
            align-items: center;
            h1 {
                margin: 10px auto;
            }
        }
        .ment_box {
            background-color: #80808054;
            height: 30%;
        }
        .chat_box {
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: skyblue;
            height: 60%;
            .chat_main {
                border-radius: 10px;
                background-color: white;
                margin: 10px auto;
                width: 95%;
                height: 95%;
            }
            .chat_input {
                height: 10%;
                width: 100%;
                align-content: center;
                text-align: center;
                input {
                    width: 85%;
                }
                button {
                    width: 40px;
                    margin-left: 5px;
                    border: none;
                    background-color: yellow;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
        }
    }
`;
const nick = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8"];
const MafiaGameRoom = ({ room }) => {
    console.log(room);
    const navigator = useNavigate();
    const outBtn=()=>{
        axiosUtils.patch(`/games/minus/${room.g_seq}`);
        console.log('아웃')
        navigator(-1);
    }
    return (
        <RoomContainer>
            <div className="side_zone">
                <div className="side_box">
                    <div className="user_box">
                        {nick
                            ?.map((item, index) => (
                                <div key={index} className="user_profile">
                                    <div className="profile_box">
                                        <img src="/images/profile.png" alt="" />
                                        <span>게임아이디: {item}</span>
                                    </div>
                                </div>
                            ))
                            .slice(0, 4)}
                    </div>
                    <div className="event_zone">
                        <div className="btn_box">
                            <button>초대</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="play_zone">
                <div className="title_box">
                    <h1>Mafia game Room</h1>
                </div>

                <div className="ment_box">사진?영상?</div>

                <div className="chat_box">
                    <div className="chat_main"></div>
                    <div className="chat_input">
                        <input type="text" />
                        <button>전송</button>
                    </div>
                </div>
            </div>
            <div className="side_zone">
                <div className="side_box">
                    <div className="user_box">
                        {nick
                            ?.map((item, index) => (
                                <div key={index} className="user_profile">
                                    <div className="profile_box">
                                        <img src="/images/profile.png" alt="" />
                                        <span>게임아이디: {item}</span>
                                    </div>
                                </div>
                            ))
                            .slice(4, 8)}
                    </div>
                    <div className="event_zone">
                        <div className="btn_box">
                            <button onClick={outBtn}>나가기</button>
                        </div>
                    </div>
                </div>
            </div>
        </RoomContainer>
    );
};

export default MafiaGameRoom;
