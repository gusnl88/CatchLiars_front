// import styled from "styled-components";

// const GlobalStyle = styled.div`
//     @keyframes rotate {
//         100% {
//             transform: rotate(1turn);
//         }
//     }

//     @keyframes blink {
//         40% {
//             opacity: 0.5;
//         }
//         80% {
//             opacity: 1;
//         }
//     }

//     .rotated_box {
//         position: relative;
//         width: 200px;
//         height: 200px;
//         overflow: hidden;

//         &::before {
//             content: "";
//             position: absolute;
//             left: -50%;
//             top: -50%;
//             width: 200%;
//             height: 200%;
//             background-repeat: no-repeat;
//             background-size: 50% 50%;
//             background-position: 0 0, 100% 0, 100% 100%, 0 100%;
//             background-image: linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300),
//                 linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5);
//             animation: rotate 3s linear infinite;
//         }

//         &:after {
//             content: "";
//             position: absolute;
//             top: 6px;
//             left: 6px;
//             right: 6px;
//             bottom: 6px;
//             background: #fff;
//         }
//     }
// `;

// export default function chat() {
//     return (
//         <GlobalStyle>
//             <div style="display: flex; gap: 10px;">
//                 <div class="rotated_box"></div>
//                 <div class="rotated_box_demo"></div>
//             </div>
//         </GlobalStyle>
//     );
// }
