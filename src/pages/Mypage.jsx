import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosUtils from "../utils/axiosUtils";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #00154b;
    color: white;
    min-height: 100vh;
`;

const ProfileDetails = styled.div`
    margin: 20px;
    font-size: 20px;
`;

// API 호출 함수
const fetchProfile = async () => {
    try {
        const response = await axiosUtils.get(
            `/users/myPage` //{ withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("프로필 조회 실패:", error);
        throw error;
    }
};

const updateProfile = async (profileData) => {
    try {
        const response = await axiosUtils.post(`user/mypage`, profileData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("프로필 업데이트 실패:", error);
        throw error;
    }
};

export default function Mypage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile()
            .then((data) => {
                setProfile(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading profile:", err);
                setError("프로필 조회에 실패했습니다.");
                setLoading(false);
            });
    }, []);

    if (loading) return <Container>Loading...</Container>;
    if (error) return <Container>{error}</Container>;
    if (!profile) return <Container>사용자 정보를 찾을 수 없습니다.</Container>;

    return (
        <Container>
            <h1>마이 페이지</h1>
            <ProfileDetails>
                <p>이름: {profile.name}</p>
                <p>이메일: {profile.email}</p>
                <p>닉네임: {profile.nickname}</p>
                {/* 필요하다면 추가 정보를 여기에 표시 */}
            </ProfileDetails>
        </Container>
    );
}
