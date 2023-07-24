import { useContext, useState } from "react";
import { setDoc, getDoc } from "../../config/firebase/firebase.config"
import { PlayerContext } from "../../context/player.context";

const Player = ({displayName, id, status}) => {
   const [playerReady, setPlayerReady] = useState("not ready");
   const player = JSON.parse(localStorage.getItem("player"));

   const eventHandler = async (event) => {
      switch(status) {
         case "ready":
            setPlayerReady("not ready")
           break;
         case "not ready":
            setPlayerReady("ready");
           break;
         default:
            setPlayerReady("not ready");
       } 

      setDoc("players", {...player, status: playerReady});
   }

   return (
      <div key={id}>
         <p>{displayName}</p>
         <button onClick={eventHandler}>{playerReady}</button>
      </div>
   )
}

export default Player