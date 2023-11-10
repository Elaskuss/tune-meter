import { useState } from "react";
import {
  Border,
  NameTag,
  NavOptionContainer,
  PageContainer,
  SupportTag,
  FooterContainer,
} from "./index.styles";
import NavOption from "../../components/nav-button/nav-option.component";
import GameForm from "../../components/game-form/game-form.component";
import { useEffect } from "react";
import { disconnectNow } from "../../config/firebase/realtime_database";

const Index = () => {
  const [joinGame, setJoinGame] = useState("join");

  useEffect(() => {
    if (localStorage.getItem("id")) {
      disconnectNow(localStorage.getItem("id"));
    }
  }, []);

  const handleClick = (event) => {
    setJoinGame(event.target.value);
    const border = document.querySelector(".border");
    if (event.target.value === "join") {
      border.classList.add("join");
      border.classList.remove("host");
    } else {
      border.classList.add("host");
      border.classList.remove("join");
    }
  };

  return (
    <PageContainer
      style={{
        minHeight: `${document.documentElement.clientHeight}px`,
      }}
    >
      <NavOptionContainer>
        <NavOption
          value={"join"}
          promt={"Join Game"}
          className="join"
          onClick={handleClick}
        />
        <NavOption
          value={"host"}
          promt={"Host Game"}
          className="host"
          onClick={handleClick}
        />
        <Border className="border"></Border>
      </NavOptionContainer>

      {joinGame === "join" ? (
        <GameForm type={"text"} promt={"Join"} />
      ) : (
        <GameForm type={"hidden"} promt={"Create Room"} />
      )}
      <FooterContainer>
        <NameTag>Created by Ivan Knezevic</NameTag>
        <SupportTag target="_blank" href="https://ko-fi.com/ivanknezevic">
          Buy me a coffee!
        </SupportTag>
      </FooterContainer>
    </PageContainer>
  );
};

export default Index;
