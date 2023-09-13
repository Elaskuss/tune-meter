import styled from "styled-components";

export const PlayerContainer = styled.div`
   margin-top: 0px;
   display: flex;
   width: 80%;
   justify-content: space-between;

   p {
      width: 150px;
      text-align: center;
      font-size: 16px;
      margin: 0px;
      align-self: center;
      @media (max-width: 900px) {
         padding: 3px 5px;
         font-size: 12px;
         width: 100px;
      }
   }

   @media (min-width: 900px) {
      width: 40%;
   }
`;

export const DisplayName = styled.h2`
   justify-self: center;
   font-size: 40px;
   @media (max-width: 900px) {
      font-size: 20px;
   }
   align-self: flex-start;
`;

export const Ready = styled.button`
   display: inline-block;
   padding: 10px 20px;
   width: 150px;
   height: 50px;
   align-self: center;
   background-color: #1db954; 
   color: #ffffff;
   font-weight: 700;
   border: none;
   border-radius: 50px;
   font-size: 16px;
   cursor: pointer;
   
   @media (max-width: 900px) {
      padding: 3px 5px;
      font-size: 12px;
      width: 100px;
   }

   &:disabled {
      background-color: #cccccc; /* Change the color for disabled state */
      cursor: not-allowed;
   }
`;
