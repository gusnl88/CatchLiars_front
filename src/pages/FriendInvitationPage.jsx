import React, { useEffect, useState } from "react";
import axiosUtils from "../utils/axiosUtils";
import styled from "styled-components";

const InvitationItem = styled.li`
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; // 내용이 넘칠 경우 다음 줄로 이동

    div {
        display: flex;
        align-items: center;
    }
`;

const Notisbox = styled.div`
    z-index: 1;
    position: absolute;
    left: -160px;
    top: 50px;
    width: 320px;
    max-height: 200px;
    background-color: #ffffffaf;
    border-radius: 5px;
    padding: 20px;
    overflow-y: auto;

    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
`;

const Nbutton = styled.button`
    padding: 5px 10px; // 패딩 감소
    margin-left: 2px;
    font-size: 12px; // 글자 크기 증가
    font-weight: bold;
    color: white;
    background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
    border: none;
    border-radius: 30px;
    cursor: pointer;
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-image: linear-gradient(to right, #2575fc 0%, #6a11cb 100%);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    &:active {
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
        transform: translateY(2px);
    }

    &:focus {
        box-shadow: 0 0 0 3px rgba(50, 50, 250, 0.5);
    }
`;

export default function FriendInvitationPage() {
    const [invitations, setInvitations] = useState([]);
    const [nickname, setNickname] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const response = await axiosUtils.get(`/invites/list`); // 친구 초대만 조회
            // {invitationList: Array(1), nickname: Array(1)}
            console.log(response.data.invitationList);
            setInvitations(response.data.invitationList);
            setNickname(response.data.nickname);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching invitations:", err);
            setError("초대 목록을 불러오는 데 실패했습니다.");
            setLoading(false);
        }
    };

    const acceptInvitation = async (f_seq, i_seq) => {
        try {
            const response = await axiosUtils.post(`/invites/accept`, { f_seq, type: 0 });
            if (response.data) {
                alert("친구가 추가되었습니다.");
                deleteInvitation(i_seq); // 초대 수락 후 삭제
            }
        } catch (err) {
            alert("초대 수락에 실패했습니다.");
        }
    };

    const deleteInvitation = async (i_seq) => {
        try {
            console.log("i_seq", i_seq);
            const response = await axiosUtils.delete(`/invites`, { data: { i_seq } });
            console.log(response.data);
            if (response.data) {
                fetchInvitations(); // 초대 삭제 후 목록 다시 불러오기
            } else {
                alert("삭제 실패: 이미 처리된 초대일 수 있습니다.");
            }
        } catch (err) {
            alert("초대 삭제에 실패했습니다.");
        }
    };

    return (
        <>
            <Notisbox>
                <ul>
                    {invitations.length > 0 ? (
                        invitations.map((invite, index) => (
                            <InvitationItem key={invite.i_seq}>
                                {nickname[index]} 님이 친구 요청을 보냈습니다.
                                <div>
                                    <Nbutton
                                        onClick={() => acceptInvitation(invite.f_seq, invite.i_seq)}
                                    >
                                        수락
                                    </Nbutton>
                                    <Nbutton onClick={() => deleteInvitation(invite.i_seq)}>
                                        거절
                                    </Nbutton>
                                </div>
                            </InvitationItem>
                        ))
                    ) : (
                        <li>친구 초대가 없습니다.</li>
                    )}
                </ul>
            </Notisbox>
        </>
    );
}
