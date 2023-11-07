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
  StartGame,
} from "./lobby.styles";
import SelectCatagory from "../../components/select-catagory/select-catagory.component";

const Lobby = () => {
  const navigate = useNavigate();
  const { players, player, updatePlayer, updateLobby, lobby } =
    useContext(PlayerContext);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [readyPlayerCount, setRadyPlayerCount] = useState(0);
  const [host, setHost] = useState(0);

  const gameKey = player.gameKey;

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(
        () => setCountdown((prevCountdown) => prevCountdown - 1),
        1000
      );
    } else if (isCountdownActive && countdown === 0) {
      setIsCountdownActive(false);
      updatePlayer({ totalPlayers: players.length });
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

    // eslint-disable-next-line
  }, [players]);

  const handleStartGame = () => {
    updateLobby({ ...lobby, canJoin: false });
  };

  useEffect(() => {
    const showCategories = async () => {
      setHost(lobby.host);
    };

    showCategories();
    setIsCountdownActive(!lobby.canJoin);
  }, [lobby]);

  return (
    <LobbyContainer containerHeight={document.documentElement.clientHeight}>
      <GameKey id="GameKey">{gameKey}</GameKey>
      <PlayersContainer>
        {players.length > 0 &&
          players.map((player) => (
            <Player
              disable={players.length < 2 || isCountdownActive}
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
          {readyPlayerCount === players.length &&
          players.length > 0 &&
          host === player.id ? (
            <>
              {isCountdownActive ? (
                <Info>
                  <span>Game starts in... {countdown}</span>
                </Info>
              ) : (
                <StartGame onClick={handleStartGame}>Start game</StartGame>
              )}
            </>
          ) : (
            <Info>
              {players.length > 1 ? (
                <>
                  {readyPlayerCount === players.length ? (
                    <>
                      {isCountdownActive ? (
                        <span>Game starts in... {countdown} </span>
                      ) : (
                        <span>Waiting for host to start the game</span>
                      )}
                    </>
                  ) : (
                    <span>
                      People in lobby ({readyPlayerCount}/{players.length})
                    </span>
                  )}
                </>
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
