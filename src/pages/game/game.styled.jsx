import { styled } from "styled-components";

export const GameContainer = styled.div`
   width: 100vw;
   display: flex;
   flex-direction: column;
   justify-content: center;
   overflow: hidden;
`;

export const SliderContainer = styled.div`
   top: 20%;
   position: absolute;
`;

export const Title = styled.h1`
   position: absolute;
   top: 20px;
   padding: 0px;
   width: 100%;
   text-align: center;
   margin: 0px;

   @media (max-width: 900px) {
      font-size: 24px;
   }
`;

export const WaitingForContainer = styled.div`
   width: 100%;
   position: absolute;
   bottom: 10px;
   box-sizing: border-box;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: start;
   margin: 0px;
   padding: 0px;
`;

export const RoundInfo = styled.h3`
   margin-bottom: 10px;
   padding: 0px;
   margin: 0px;
   text-align: center;
`;
