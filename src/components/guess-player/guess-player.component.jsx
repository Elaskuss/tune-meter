import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import GuessThePlayer from "./guess-player.styles";

const GuessPlayer = ({ song, playerInfo, ...otherProps }) => {
   const { player, updatePlayer } = useContext(PlayerContext);
   const componentLoadTime = Date.now();

   const handleClick = () => {
      if (song.whosSpotify === playerInfo.id) {
         const buttonPressTime = Date.now();
         const timeElapsed = buttonPressTime - componentLoadTime;
         let maxPoints = 30000;

         if(song.whosSpotify === player.id){
            maxPoints = maxPoints * 0.5;
         }

         const myPoints = maxPoints - timeElapsed;

         const points = Math.ceil(myPoints / 1000) * 100;

         if(points < 100) {
            let playerPoints = player.points + 100
            updatePlayer({...player, points: playerPoints, guessed: true});
         }else {
            console.log(player.points + points + " Points");
            let playerPoints = player.points + points
            updatePlayer({...player, points: playerPoints, guessed: true});
         }
         
      }
      else{
         console.log("No Points")
         updatePlayer({...player, guessed: true});
      }
   };
   return (
      <GuessThePlayer key={playerInfo.id} disabled={player.guessed} onClick={handleClick} {...otherProps}>
         {playerInfo.displayName}
      </GuessThePlayer>
   );
};
export default GuessPlayer;
