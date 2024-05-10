import React, { useEffect, useState } from "react";
import axiosUtils from "../utils/axiosUtils";
import styled from "styled-components";

const Modal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <button onClick={onClose}>확인</button>
            </ModalContent>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
`;

const ModalContent = styled.div`
    width: 300px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const InvitationItem = styled.li`
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    div {
        display: flex;
        align-items: center;
    }
`;

const Notisbox = styled.div`
    z-index: 1;
    position: absolute;
    left: -200px;
    top: 50px;
    width: 360px;
    max-height: 200px;
    background-color: #ffffffaf;
    border-radius: 5px;
    padding: 20px;
    overflow-y: auto;

    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        width: 100%;
        width: 200px;
        left: 50%;
        transform: translateX(-50%);
        top: 20px;
    }
`;

const Nbutton = styled.button`
    padding: 5px 10px;
    margin-left: 2px;
    font-size: 12px;
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

const CloseButton = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
`;

export default function FriendInvitationPage() {
    const [invitations, setInvitations] = useState([]);
    const [nickname, setNickname] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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

    const acceptInvitation = async (f_seq, i_seq, i_type, g_seq) => {
        try {
            if (i_type) {
                if (g_seq) {
                    window.location.href = `/games/list/Mafia/${g_seq}`;
                    deleteInvitation(i_seq);
                } else {
                    alert("해당 방이 존재하지 않습니다.");
                    deleteInvitation(i_seq);
                }
            }
            const response = await axiosUtils.post(`/invites/accept`, {
                f_seq: f_seq,
                type: i_type,
                g_seq: g_seq,
            });
            if (response.data === true) {
                if (i_type === 0) {
                    alert("친구가 추가되었습니다.");
                } else if (i_type === 1) {
                    alert("게임 방으로 이동합니다.");
                }

                deleteInvitation(i_seq);
            } else {
                alert(response.data);
                setModalOpen(true);
            }
        } catch (error) {
            console.error("초대 수락에 실패했습니다:", error);
            alert("초대 수락에 실패했습니다.");
            setModalOpen(true);
        }
    };

    const deleteInvitation = async (i_seq) => {
        try {
            console.log("i_seq", i_seq);
            const response = await axiosUtils.delete(`/invites`, { data: { i_seq } });
            console.log(response.data);
            if (response.data) {
                fetchInvitations();
            } else {
                alert("삭제 실패: 이미 처리된 초대일 수 있습니다.");
            }
        } catch (err) {
            alert("초대 삭제에 실패했습니다.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <Notisbox>
                    <CloseButton onClick={closeModal}>x</CloseButton>
                    <ul>
                        {invitations.length > 0 ? (
                            invitations.map((invite, index) => (
                                <InvitationItem key={invite.i_seq}>
                                    {invite.i_type
                                        ? `${nickname[index]} 님이 게임 초대를 보냈습니다.`
                                        : `${nickname[index]} 님이 친구 요청을 보냈습니다.`}

                                    <div>
                                        <Nbutton
                                            onClick={() =>
                                                acceptInvitation(
                                                    invite.f_seq,
                                                    invite.i_seq,
                                                    invite.i_type,
                                                    invite.g_seq
                                                )
                                            }
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
            )}
        </>
    );
}
