import { styled } from "styled-components";

export const GameContainer = styled.div`
   height: 100vh;
   width: 100vw;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   overflow: hidden;
`;


export const SliderContainer = styled.div`
   position: relative;
   height: 60%;
`

export const Title = styled.h1`
   width: 100%;
   text-align: center;
`;

export const WaitingForContainer = styled.div`
   position: relative;
   box-sizing: border-box;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: center;
   bottom: 10px;
`;
