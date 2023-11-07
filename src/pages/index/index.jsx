import { useContext, useState } from "react";
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
import { createPlayer } from "../../config/firebase/realtime_database";
import { PlayerContext } from "../../context/player.context";

const Index = () => {
  const [joinGame, setJoinGame] = useState("join");
  const { updatePlayer } = useContext(PlayerContext);

  useEffect(() => {
    const createPlayerObject = async () => {
      const id = await createPlayer();
      updatePlayer({id: id});
    };
    if (localStorage.getItem("id") === null) {
      createPlayerObject();
    } else {
      updatePlayer({id: localStorage.getItem("id"), gameKey: "", displayName: ""});
    }
    // eslint-disable-next-line
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
