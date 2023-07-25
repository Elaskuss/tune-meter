import styled from "styled-components";

export const LobbyContainer = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   height: 100vh;
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
   height: 60vh;
   width: 80vw;
`;
export const GameKey = styled.h1`
   position: relative;
   width: 100vw;
   align-self: flex-start;
   text-align: center;
   margin-bottom: 50px;
   font-size: 10vw;
`;
