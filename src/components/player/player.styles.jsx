import styled from "styled-components";

export const PlayerContainer = styled.div`
   display: flex;
   width: 100%;
   justify-content: space-between;

   button {
      width: 100px;
      height: 50px;
      font-size: 12px;
      align-self: flex-end;
      margin: 2vw;
   }
   p {
      width: 100px;
      height: auto;
      align-self: center;
      margin: 2vw;
      font-size: 12px;
      align-items: center;
      justify-content: center;
      text-align: center;
   }
   h2 {
      font-size: 6vw;
      margin: 2vw;
      align-self: flex-start;
   }
`;
