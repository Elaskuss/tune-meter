import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";
import Player from "../../components/player/player.component";

const Lobby = () => {
   const { players, player } = useContext(PlayerContext);
   const navigate = useNavigate();

   
   const gameKey = player.gameKey

   useEffect(() => {
      if(gameKey === ""){
         navigate("/");
      }
   }, []);

   return (
      <div>
         <h1>{gameKey}</h1>
         <div>
            {players.length > 0 && players.map((player) => (<Player displayName={player.displayName} id={player.id} status={player.status}/>))}
         </div>
      </div>
      
   );
};

export default Lobby;
