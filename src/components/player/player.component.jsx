import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { PlayerContainer } from "./player.styles";

const Player = ({displayName, id, status}) => {
   const {updatePlayer, player, spotifyPlayer} = useContext(PlayerContext);

   const notReady = {...player, status: "NOT READY" };
   const ready = {...player, status: "READY" };

   const readyHandler = async () => {
      switch(player.status) {
         case "READY":
            updatePlayer(notReady)
           break;
         case "NOT READY":
            updatePlayer(ready)
           break;
         default:
            updatePlayer(notReady);
            break;
       }

       spotifyPlayer.activateElement().then((promise) => {
         console.log(promise);
       });
   }

   return (
      <PlayerContainer key={id}>
         <h2>{displayName}</h2>
         {player.id === id ?<button onClick={readyHandler}>{status}</button> : <p>{status}</p>}
      </PlayerContainer>
   )
}

export default Player