import React, { useEffect, useState } from "react";
import axiosUtils from "../utils/axiosUtils";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    background-color: #f4f4f4;
`;

const InvitationList = styled.ul`
    list-style: none;
    padding: 0;
`;

const InvitationItem = styled.li`
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Button = styled.button`
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
`;

function FriendInvitationPage() {
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

    if (loading) return <Container>Loading...</Container>;
    if (error) return <Container>Error: {error}</Container>;

    return (
        <Container>
            <h1>친구 초대 목록</h1>
            <InvitationList>
                {invitations.map((invite, index) => (
                    <InvitationItem key={invite.i_seq}>
                        <span>{nickname[index]} 님이 친구 요청을 보냈습니다.</span>
                        <div>
                            <Button onClick={() => acceptInvitation(invite.f_seq, invite.i_seq)}>
                                수락
                            </Button>
                            <Button onClick={() => deleteInvitation(invite.i_seq)}>거절</Button>
                        </div>
                    </InvitationItem>
                ))}
            </InvitationList>
        </Container>
    );
}

export default FriendInvitationPage;
