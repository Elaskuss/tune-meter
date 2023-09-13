import { styled } from "styled-components";

export const GameContainer = styled.div`
   height: 100vh;
   width: 100vw;
   display: flex;
   flex-direction: column;
   justify-content: center;
   overflow: hidden;
`;

export const SliderContainer = styled.div`
   position: relative;
`;

export const Title = styled.h1`
   position: absolute;
   top: 0px;
   width: 100%;
   text-align: center;

   @media (max-width: 900px) {
      font-size: 24px;
   }
`;

export const WaitingForContainer = styled.h4`
   width: 100%;
   position: absolute;
   bottom: 10px;
   box-sizing: border-box;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: start;
`;
