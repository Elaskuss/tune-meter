import styled from "styled-components";

export const NavOptionContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;

  @media (min-width: 900px) {
    width: 40vw;
  }
`;

export const PageContainer = styled.div`
  width: 70vw;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (min-width: 900px) {
    width: 40vw;
  }
`;

export const Border = styled.div`
  position: absolute;
  width: 50%;
  height: 2px;
  bottom: 0px;
  background-color: #ffffff;
  transition-duration: 200ms;
  transition-property: transform;

  &.join {
    transform: translate(0%);
  }
  &.host {
    transform: translate(100%);
  }
`;

export const AutoPlay = styled.button`
  margin-top: 30px;
  display: inline-block;
  padding: 10px 20px;
  width: 230px;
  height: 50px;
  background-color: #1db954; /* Spotify green color */
  color: #ffffff;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
`;

export const AutoPlayContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
export const SpotifyAccess = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;

  h1 {
    position: absolute;
    top: 10px;
  }
`;

export const NameTag = styled.p`
  text-align: center;
  font-size: 16px;
`;

export const SupportTag = styled.a`
  text-align: center;
  font-size: 16px;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  margin: 0px;
  bottom: 30px;
`;
