import styled from "styled-components";

export const LobbyContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h2 {
    justify-content: center;
    text-align: center;
    justify-self: flex-end;
  }
`;
export const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 70vh;
  max-height: 70vh;
  width: 100vw;
  align-items: center;
  overflow-y: scroll;

  @media (max-width: 900px) {
    margin-top: 50px;
  }
`;
export const GameKey = styled.h1`
  position: fixed;
  top: 20px;
  align-self: center;
  text-align: center;
  margin: 0px;
  font-size: 70px;

  @media (max-width: 900px) {
    top: 20px;
    font-size: 50px;
  }
`;

export const PlayerCounter = styled.div`
  width: 100%;
  box-sizing: border-box;
`;
export const Info = styled.h2``;

export const BottomItems = styled.div`
  position: fixed;
  bottom: 10px;
  width: 100%;
`;
