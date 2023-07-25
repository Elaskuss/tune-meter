import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";
import Player from "../../components/player/player.component";
import { GameKey, LobbyContainer, PlayersContainer } from "./lobby.styles";

const Lobby = () => {
   const { players, player } = useContext(PlayerContext);
   const [playerCount, setPlayerCount] = useState(0);
   const navigate = useNavigate();

   const gameKey = player.gameKey;

   useEffect(() => {
      if (gameKey === "") {
         navigate("/");
      }
   }, []);

   useEffect(() => {
      playerCounter();
   }, [players]);

   const playerCounter = () => {
      setPlayerCount(0);
      players.forEach((player) => {
         if (player.status === "READY") {
            console.log(player);
            setPlayerCount(playerCount + 1);
         }
      });
   };

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
         <h2>
            PLAYERS READY ({playerCount}/{players.length})
         </h2>
      </LobbyContainer>
   );
};

export default Lobby;
