import { useContext, useEffect } from "react";
import { PlayerContext } from "../../context/player.context";
import { PlayerContainer } from "./player.styles";
import { setVolume } from "../../config/spotify/spotify.config";
import { useState } from "react";

const Player = ({displayName, id, status}) => {
   const token = sessionStorage.getItem("access_token"); 
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

   return (
      <PlayerContainer key={id}>
         <h2>{displayName}</h2>
         {player.id === id ?<button onClick={readyHandler}>{status}</button> : <p>{status}</p>}
      </PlayerContainer>
   )
}

export default Player