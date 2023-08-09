import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";

const ShowPoints = () => {
   const {players} = useContext(PlayerContext);
   
   players.sort((a, b) => b.points - a.points);

   return (
      <div>
         {players.map((player) => {
            return(
               <div key={player.id}>
                  <p >{player.displayName}</p>
                  <p>{player.points}</p>
               </div>
            )
         })}
      </div>
   )
}

export default ShowPoints;