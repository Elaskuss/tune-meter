import { useContext, useEffect } from "react";
import { setDoc } from "../../config/firebase/firebase.config";
import { PlayerContext } from "../../context/player.context";
import { useNavigate } from "react-router-dom";
import { getPlaylist, getProfile, getSongs } from "../../config/spotify/spotify.config";

const Game = () => {
   const navigate = useNavigate();
   const {player} = useContext(PlayerContext);
   setDoc("lobbies/" + player.gameKey, {gameActive: true})

   
   getProfile();

   return (
      <div>
         <h1>Yaay</h1>
      </div>
   )
} 

export default Game;