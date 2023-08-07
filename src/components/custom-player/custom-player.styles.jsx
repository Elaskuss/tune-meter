import { styled } from "styled-components";

export const NameContainer = styled.div`
   display: flex;
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

export const NextTrackContainer = styled.div`
   width: 300px;
   display: flex;
   align-items: center;
   justify-content:  center;
`

export const NextSongContainer = styled.div`
   align-items: center;
   display: flex;
   flex-direction: column;
   width: 100%;
`;
