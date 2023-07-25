import { useContext } from "react";
import { setDoc, getDoc } from "../../config/firebase/firebase.config"
import { PlayerContext } from "../../context/player.context";

const Player = ({displayName, id, status}) => {
   const {updatePlayer, player} = useContext(PlayerContext);

   const notReady = { ...player, status: "not ready" };
   const ready = { ...player, status: "ready" };

   const eventHandler = async () => {
      switch(status) {
         case "ready":
            updatePlayer(notReady)
           break;
         case "not ready":
            updatePlayer(ready)
           break;
         default:
            updatePlayer(notReady)
       } 
   }

   return (
      <div key={id}>
         <p>{displayName}</p>
         {player.id === id ?<button onClick={eventHandler}>{status}</button> : <p>{status}</p>}
      </div>
   )
}

export default Player