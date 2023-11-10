const { styled } = require("styled-components");

export const SliderContainer = styled.div`
   display: flex;
   width: 100vw;
   height: 100%;
   justify-content: center;
   align-items: center;
   flex-direction: column;
`;

export const SliderInfo = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const StyledSlider = styled.input`
   width: 100%;
   height: 20px;
   appearance: none;
   background: white;
   border-radius: 5px;
   outline: none;
   opacity: 0.7;
   transition: opacity 0.2s;

   &:hover {
      opacity: 1;
   }

   &:focus {
      opacity: 1;
   }

   /* Styling the thumb (slider handle) */
   &::-webkit-slider-thumb {
      appearance: none;
      width: 30px;
      height: 30px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
   }

   &::-moz-range-thumb {
      width: 30px;
      height: 30px;
      background: #007bff;
      border: none;
      border-radius: 50%;
      cursor: pointer;
   }
`;

export const SliderValue = styled.h1`
`;

export const TheAnswer = styled.div`
   position: absolute;
   width: 50px;
   height: 50px;
   border-radius: 0%;
   background-color: white;
`;

export const Emoji = styled.p`
   font-size: 60px;

   @media (max-width: 900px) {
      font-size: 30px;
   }
`;

export const PointsContainer = styled.div`
   position: relative;
   width: 60vw;
`;
export const Confirm = styled.button`
   display: inline-block;
   padding: 10px 20px;
   width: 150px;
   height: 50px;
   align-self: center;
   background-color: #1db954; /* Spotify green color */
   color: #ffffff;
   font-weight: 700;
   border: none;
   border-radius: 50px;
   font-size: 16px;
   cursor: pointer;

   &:disabled {
      background-color: #cccccc; /* Change the color for disabled state */
      cursor: not-allowed;
   }

   @media (max-width: 900px) {
      padding: 3px 5px;
      font-size: 12px;
      width: 100px;
   }
`;

export const Spinner = styled.div`
   display: flex;
   justify-content: center;
   margin-bottom: 30px;
   .lds-ellipsis {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
   }
   .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
   }
   .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
   }
   .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
   }
   .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
   }
   .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
   }
   @keyframes lds-ellipsis1 {
      0% {
         transform: scale(0);
      }
      100% {
         transform: scale(1);
      }
   }
   @keyframes lds-ellipsis3 {
      0% {
         transform: scale(1);
      }
      100% {
         transform: scale(0);
      }
   }
   @keyframes lds-ellipsis2 {
      0% {
         transform: translate(0, 0);
      }
      100% {
         transform: translate(24px, 0);
      }
   }
`;
