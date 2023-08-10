import { styled } from "styled-components";

const GuessThePlayer = styled.button`
   display: inline-block;
   padding: 10px 20px;
   width: 200px;
   height: 50px;
   align-self: center;
   background-color: #1db954; /* Spotify green color */
   color: #ffffff;
   font-weight: 700;
   border: none;
   border-radius: 50px;
   font-size: 16px;
   cursor: pointer;

   @media (max-width: 900px) {
      align-items: space-around;
      padding: 3px 5px;
      font-size: 12px;
      width: 200px;
   }
`;

export default GuessThePlayer;
