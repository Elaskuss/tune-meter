import styled from "styled-components";

export const LobbyContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100svh;
  h2 {
    justify-content: center;
    text-align: center;
    justify-self: flex-end;
  }
`;
export const PlayersContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 100vw;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 25px;
  overflow-y: auto;
`;
export const GameKey = styled.h1`
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
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
`;
export const Info = styled.h2`
  margin-left: 20px;
  margin-right: 20px;
`;

export const BottomItems = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

export const StartGame = styled.button`
  display: inline-block;
  margin-top: 20px;
  margin-bottom: 20px;
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
