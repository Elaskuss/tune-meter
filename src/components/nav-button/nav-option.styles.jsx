import styled from "styled-components";

export const NavOptionStyle = styled.button`
   width: 100%;
   height: 100px;
   color: inherit;
   background: none;
   border:none;
   font-weight: 1000;
   font-size: 30px;

   @media (max-width: 680px) {
      font-size: 18px;
   }

   &:hover{
      cursor: pointer;
      font-size: 32px;

      @media (max-width: 680px) {
      font-size: 20px;
   }
   }
`;

