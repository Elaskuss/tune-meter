import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";
import Player from "../../components/player/player.component";
import { GameKey, LobbyContainer, PlayersContainer } from "./lobby.styles";

const Lobby = () => {
   const navigate = useNavigate();
   const { players, player, updatePlayer } = useContext(PlayerContext);
   const [countdown, setCountdown] = useState(5);
   const [isCountdownActive, setIsCountdownActive] = useState(false);
   const [playerCount, setPlayerCount] = useState(0);

   const gameKey = player.gameKey;

   window.addEventListener("beforeunload", () => {
      const updatedPlayer = { ...player, gameKey: "" };
      updatePlayer(updatedPlayer);
   });

   window.addEventListener("popstate", (event) => {
      navigate("/", {replace: true});
   });

   useEffect(() => {
      if (gameKey === "") {
         navigate("/", { replace: true });
      }
      // eslint-disable-next-line
   }, []);

   const countDownHandler = (value) => {
      setIsCountdownActive(value);
   };

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
   }, [isCountdownActive, countdown]);

   const playerCounter = useCallback(() => {
      setPlayerCount(0);
      const readyPlayersCount = players.reduce((count, player) => {
         if (player.status === "READY") {
            return count + 1;
         }
         return count;
      }, 0);

      setPlayerCount(readyPlayersCount);
   }, [players]);

   useEffect(() => {
      playerCounter();
      if (players.length === playerCount && players.length > 1) {
         countDownHandler(true);
         setCountdown(5);
      } else {
         countDownHandler(false);
      }
   }, [players, playerCount, playerCounter]);

   return (
      <LobbyContainer>
         <GameKey>{gameKey}</GameKey>
         <PlayersContainer>
            {players.length > 0 &&
               players.map((player) => (
                  <Player
                     displayName={player.displayName}
                     id={player.id}
                     status={player.status}
                  />
               ))}
         </PlayersContainer>
         <>
            {playerCount === players.length && players.length > 1 ? (
               <h2>Game starts in... {countdown}</h2>
            ) : (
               <h2>
                  {players.length > 1 ? (
                     <span>
                        PLAYERS READY ({playerCount}/{players.length})
                     </span>
                  ) : (
                     <span>YOU NEED MORE PLAYERS TO START</span>
                  )}
               </h2>
            )}
         </>
      </LobbyContainer>
   );
};

export default Lobby;
