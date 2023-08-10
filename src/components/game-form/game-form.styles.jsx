import styled from "styled-components";

export const FormStyle = styled.form`
   display: flex;
   width: 100%;
   flex-direction: column;
   margin-top: 5rem;

   & > * {
      margin-top: 2rem;
      height: 50px;
   }
`;

export const InputStyle = styled.input`
   border-radius: 50px;
   padding-left: 15px;
   border: none;
`;

export const LobbyButton = styled.button`
   display: inline-block;
   padding: 10px 20px;
   width: 50%;
   height: 50px;
   align-self: center;
   background-color: #1db954; /* Spotify green color */
   color: #FFFFFF;
   border: none;
   border-radius: 50px;
   font-size: 16px;
   font-weight: 700;
   cursor: pointer;

   
   @media (max-width: 900px) {
      padding: 5px 10px;
      font-size: 13px;
   }

`;
