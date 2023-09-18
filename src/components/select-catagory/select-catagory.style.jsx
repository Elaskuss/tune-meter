import styled from "styled-components";

export const ChooseCatagory = styled.div`
  top: 0px;
  position: absolute;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;
export const SelectCatagoryButton = styled.button`
  min-height: 25%;
  color: white;
  font-size: 40px;
  font-weight: 800;
  box-sizing: border-box;
  background-color: #1db954;
  border: 1px solid black;
  overflow: scroll;
`;

export const CatagoryContainer = styled.div`
  width: 100vw;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const Select = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const CatagoryButton = styled.button`
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

  @media (max-width: 900px) {
    padding: 3px 5px;
    font-size: 12px;
    width: 100px;
  }
`;
