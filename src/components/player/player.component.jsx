import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { PlayerContainer } from "./player.styles";

const Player = ({displayName, id, status, mute}) => {
   const {updatePlayer, player} = useContext(PlayerContext);

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
   }

   const muteHandler = async () => {
      updatePlayer({...player, mute: !player.mute})
   }

   return (
      <PlayerContainer key={id}>
         <h2>{displayName}</h2>
         {player.id === id ?<button onClick={readyHandler}>{status}</button> : <p>{status}</p>}
         {player.id === id ?<button onClick={muteHandler}>{mute ? "No Sound" : "Sound"}</button>: <p>{mute ? "No Sound" : "Sound"}</p>}
      </PlayerContainer>
   )
}

export default Player