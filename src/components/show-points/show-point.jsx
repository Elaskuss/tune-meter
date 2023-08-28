import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { PointsContainer, PointsInfo, Span } from "./show-points.styles";

const ShowPoints = () => {
   const {players} = useContext(PlayerContext);
   
   players.sort((a, b) => b.points - a.points);
   let count = 0;
   return (
      <PointsContainer>
         
         {players.map((player) => {
            count += 1
            return(
               <PointsInfo key={player.id}>
                  <Span>{count + '. \u00A0\u00A0' + player.displayName}</Span>
                  <Span>{player.points}</Span>
               </PointsInfo>
            )
         })}
      </PointsContainer>
   )
}

export default ShowPoints;