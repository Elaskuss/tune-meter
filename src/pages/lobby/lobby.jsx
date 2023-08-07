import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";
import Player from "../../components/player/player.component";
import { GameKey, LobbyContainer, PlayersContainer } from "./lobby.styles";

const Lobby = () => {
   const navigate = useNavigate();
   const { players, player, updatePlayer } = useContext(PlayerContext);
   const [countdown, setCountdown] = useState(1);
   const [isCountdownActive, setIsCountdownActive] = useState(false);
   const [readyPlayerCount, setRadyPlayerCount] = useState(0);

   const gameKey = player.gameKey;

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
         updatePlayer({...player, totalPlayers: players.length });
         navigate("/game", { replace: true });
      }

      return () => clearInterval(timer);
   }, [isCountdownActive, countdown]);


   useEffect(() => {
      const readyPlayersCount = players.reduce((count, player) => {
         if (player.status === "READY") {
            return count + 1;
         }
         return count;
      }, 0);

      setRadyPlayerCount(readyPlayersCount);

      if (players.length === readyPlayersCount && players.length > 1) {
         countDownHandler(true);

         if(!isCountdownActive){
            setCountdown(1);
         }
      } else {
         countDownHandler(false);
      }
   }, [players]);

   return (
      <LobbyContainer>
         <GameKey>{gameKey}</GameKey>
         <PlayersContainer>
            {players.length > 0 &&
               players.map((player) => (
                  <Player
                     displayName={player.displayName}
                     id={player.id}
                     key={player.id}
                     status={player.status}
                     mute={player.mute}
                  />
               ))}
         </PlayersContainer>
         <>
            {readyPlayerCount === players.length && players.length > 1 ? (
               <h2>Game starts in... {countdown}</h2>
            ) : (
               <h2>
                  {players.length > 1 ? (
                     <span>
                        PLAYERS READY ({readyPlayerCount}/{players.length})
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
