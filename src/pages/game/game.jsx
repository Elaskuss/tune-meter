import { useContext, useEffect } from "react";
import { setDoc } from "../../config/firebase/firebase.config";
import { PlayerContext } from "../../context/player.context";
import { useNavigate } from "react-router-dom";
import {
   getPlaylist,
   getProfile,
   getSongs,
   getTopTracks,
} from "../../config/spotify/spotify.config";

const Game = () => {
   const { player } = useContext(PlayerContext);
   setDoc("lobbies/" + player.gameKey, { gameActive: true });

   useEffect(() => {
      getTopTracks();
   }, []);

   return (
      <div>
         <h1>Yaay</h1>
      </div>
   );
};

export default Game;
