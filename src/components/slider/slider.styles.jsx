const { styled } = require("styled-components");

export const SliderContainer = styled.div`
   display: flex;
   width: 100vw;
   height: 60vh;
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

export const TheAnswer = styled.div`
   position: absolute;
   width: 50px;
   height: 50px;
   border-radius: 0%;
   background-color: white;
`;

export const Emoji = styled.p`
   font-size: 60px;
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
