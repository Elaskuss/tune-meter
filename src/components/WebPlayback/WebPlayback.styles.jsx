import { styled } from "styled-components";

export const NameContainer = styled.div`
   display: flex;
   width: 100%;
`;

export const SongName = styled.p`
   margin-top: 0px;
   font-size: 16px;
   margin-bottom: 0;
`;

export const ArtistName = styled.p`
   font-size: 11px;
   margin-top: 1px;
`;

export const FastForward = styled.div`
   width: 30px;
   color: #828282;
   &:hover {
      width: 32px;
      color: #ecebe8;
   }
   &.selected {
      color: white;
   }
`;

export const SongInfo = styled.div``;

export const StyledHeart = styled.svg`
   align-self: center;
   width: 30px;
   height: 30px;
   right: 0px;
   transform: translate(-125%, 0%);
   position: absolute;
`;

export const StyledPlayerContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   background: #191414;
   color: #fff;

   @media (max-width: 900px) {
      width: 100vw;
      height: 70vh;
   }
`;

export const Wrapper = styled.div`
   max-height: 70vh;

   display: flex;
   justify-content: center;

   @media (max-width: 900px) {
      width: 100vw;
      height: 70vh;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
   }
`;

export const SongInfoContainer = styled.div`
   width: 50%;
   box-sizing: border-box;
   padding: 40px;
   position: relative;
   display: flex;
   flex-direction: column;

   @media (max-width: 900px) {
      width: 90%;
   }
`;

export const NextTrackContainer = styled.div`
   margin-bottom: 20px;
   display: flex;
   align-items: center;
   justify-content: center;
`;

export const NextSongContainer = styled.div`
   align-items: center;
   justify-content: center;
   display: flex;
   flex-direction: column;
   width: 50%;

      @media (max-width: 900px) {
      width: 100%;
   }
`;
