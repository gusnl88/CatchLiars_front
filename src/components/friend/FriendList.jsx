import styled from "styled-components"
import axiosUtills from '../../utils/axiosUtils'
import { useEffect } from "react"
const MainContainer= styled.div`
         width: 300px;
    height: 600px;
    position: absolute;
    background: #ffffff92;
    top: 100px;
    border-radius: 10px;

`
export default function FriendList(){
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosUtills.get('/friends');
                console.log(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    return(
        <MainContainer>친구</MainContainer>
    )
}