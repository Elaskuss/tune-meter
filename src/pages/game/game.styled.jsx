import { styled } from "styled-components";

export const GameContainer = styled.div`
   height: 100vh;
   width: 100vw;
   display: flex;
   flex-direction: column;
   justify-content: center;
`;

export const Title = styled.h1`
   position: absolute;
   width: 100%;
   margin-top: 20px;
   text-align: center;
`;

export const WaitingForContainer = styled.div`
   box-sizing: border-box;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: center;
   bottom: 10px;
`;

export const Spinner = styled.div`
   display: flex;
   justify-content: center;
   margin-bottom: 30px;
   .loader {
      color: #fff;
      font-size: 10px;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      text-indent: -9999em;
      animation: mulShdSpin 1.3s infinite linear;
      transform: translateZ(0);
   }

   @keyframes mulShdSpin {
      0%,
      100% {
         box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em,
            2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em,
            -2em -2em 0 0;
      }
      12.5% {
         box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em,
            0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
      }
      25% {
         box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0,
            0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
      }
      37.5% {
         box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0,
            2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em,
            -2em -2em 0 -1em;
      }
      50% {
         box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em,
            0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
      }
      62.5% {
         box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em,
            2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0,
            -2em -2em 0 -1em;
      }
      75% {
         box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em,
            2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em,
            -2em -2em 0 0;
      }
      87.5% {
         box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
            0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
      }
   }
`;
