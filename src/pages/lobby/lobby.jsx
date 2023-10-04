import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";
import Player from "../../components/player/player.component";
import {
  BottomItems,
  GameKey,
  Info,
  LobbyContainer,
  PlayerCounter,
  PlayersContainer,
} from "./lobby.styles";
import { getDoc } from "../../config/firebase/realtime_database";
import SelectCatagory from "../../components/select-catagory/select-catagory.component";

const Lobby = () => {
  const navigate = useNavigate();
  const { players, player, updatePlayer } = useContext(PlayerContext);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [readyPlayerCount, setRadyPlayerCount] = useState(0);
  const [host, setHost] = useState(0);

  const gameKey = player.gameKey;

  const countDownHandler = (value) => {
    setIsCountdownActive(value);
  };

  useEffect(() => {
    const showCategories = async () => {
      const lobby = await getDoc(`lobbies/${player.gameKey}`);

      setHost(lobby.host);
    };

    showCategories();
  });

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(
        () => setCountdown((prevCountdown) => prevCountdown - 1),
        1000
      );
    } else if (isCountdownActive && countdown === 0) {
      setIsCountdownActive(false);
      updatePlayer({ ...player, totalPlayers: players.length });
      navigate("/game", { replace: true });
    }

    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [isCountdownActive, countdown]);

  useEffect(() => {
    const readyPlayersCount = players.reduce((count, player) => {
      if (player.status === "Ready") {
        return count + 1;
      }
      return count;
    }, 0);

    setRadyPlayerCount(readyPlayersCount);

    if (players.length === readyPlayersCount && players.length > 1) {
      countDownHandler(true);

      if (!isCountdownActive) {
        setCountdown(3);
      }
    } else {
      countDownHandler(false);
    }
    // eslint-disable-next-line
  }, [players]);

  return (
    <LobbyContainer containerHeight={window.innerHeight}>
      <GameKey id="GameKey">{gameKey}</GameKey>
      <PlayersContainer>
        {players.length > 0 &&
          players.map((player) => (
            <Player
              disable={players.length < 2}
              displayName={player.displayName}
              id={player.id}
              key={player.id}
              status={player.status}
            />
          ))}
      </PlayersContainer>
      <BottomItems id="BottomItems">
        {host === player.id && <SelectCatagory />}
        <PlayerCounter>
          {readyPlayerCount === players.length && players.length > 1 ? (
            <Info>Game starts in... {countdown}</Info>
          ) : (
            <Info>
              {players.length > 1 ? (
                <span>
                  People in lobby ({readyPlayerCount}/{players.length})
                </span>
              ) : (
                <span>You need more people to start the game</span>
              )}
            </Info>
          )}
        </PlayerCounter>
      </BottomItems>
    </LobbyContainer>
  );
};

export default Lobby;
