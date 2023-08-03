import styled from "styled-components";

export const NavOptionStyle = styled.button`
   width: 100%;
   height: 50px;
   color: inherit;
   background: none;
   border:none;

   font-size: 20px;

   &.selected{
      border-bottom: 2px solid black;
   }

   &:hover{
      background-color:rgba(230, 230, 230, 1);
   }
`;


