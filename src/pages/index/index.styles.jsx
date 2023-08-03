import styled from "styled-components";

export const NavOptionContainer = styled.div`
   display: flex;

   width: 100%;
   position: relative;
`;

export const PageContainer = styled.div`
   width: 100vw;
   height: 100vh;
   display: flex;
   align-items: center;
   flex-direction: column;
   
   @media (min-width: 680px) {
      width: 30vw;
   }
   width: 70vw;
`;
