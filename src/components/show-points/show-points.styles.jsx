import { styled } from "styled-components";

export const PointsContainer = styled.div`
   margin-top: 50px;
   display: flex;
   min-height: 150px;
   flex-direction: column;
   width: 100vw;
   align-items: center;
`;

export const Span = styled.p`
   display: inline-block;
   width: 50%;
   text-align: center;
   font-size: 20px;
   font-weight: 900;
`;

export const PointsInfo = styled.div`
   position: relative;
   width: 100%;
   @media (min-width: 900px) {
      width: 50%;
   }
`;
