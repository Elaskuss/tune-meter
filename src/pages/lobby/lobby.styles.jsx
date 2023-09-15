import styled from "styled-components";

export const LobbyContainer = styled.div`
   width: 100vw;
   align-items: center;

   h2 {
      justify-content: center;
      text-align: center;
      justify-self: flex-end;
   }
`;
export const PlayersContainer = styled.div`
   display: flex;
   flex-direction: column;
   
   max-height: 80vh;
   width: 100vw;
   align-items:center;
   overflow-y: scroll;

   @media (max-width: 900px) {
      margin-top: 50px;
   }
`;
export const GameKey = styled.h1`
   position: relative;
   align-self: center;
   text-align: center;
   margin: 0px;
   font-size: 70px;

      
   @media (max-width: 900px) {
      top: 20px;
      font-size: 50px;
   }
`;

export const PlayerCounter = styled.div`
   width: 80%;
   box-sizing: border-box;
   position: absolute;
   left: 50%;
   bottom: 10px;
   transform: translate(-50%, 0%);
`
export const Info = styled.h2`

`