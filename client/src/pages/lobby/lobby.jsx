import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";
import Player from "../../components/player/player.component";
import { GameKey, Info, LobbyContainer, PlayerCounter, PlayersContainer } from "./lobby.styles";

const Lobby = () => {
   const navigate = useNavigate();
   const { players, player, updatePlayer } = useContext(PlayerContext);
   const [countdown, setCountdown] = useState(3);
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

      // if (players.length === readyPlayersCount && players.length > 1) {
      if (players.length === readyPlayersCount) {
         countDownHandler(true);

         if(!isCountdownActive){
            setCountdown(3);
         }
      } else {
         countDownHandler(false);
      }
      // eslint-disable-next-line
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
                  />
               ))}
         </PlayersContainer>
         <PlayerCounter>
         {readyPlayerCount === players.length ? (
            // {readyPlayerCount === players.length && players.length > 1 ? (
               <Info>Music starts in... {countdown}</Info>
            ) : (
               <Info>
                  {players.length > 1 ? (
                     <span>
                        People in lobby ({readyPlayerCount}/{players.length})
                     </span>
                  ) : (
                     <span>You need more people to create a playlist</span>
                  )}
               </Info>
            )}
         </PlayerCounter>
      </LobbyContainer>
   );
};

export default Lobby;
