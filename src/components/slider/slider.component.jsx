import { useContext, useState } from "react";
import { PlayerContext } from "../../context/player.context";
import {
   Confirm,
   Emoji,
   PointsContainer,
   SliderContainer,
   SliderInfo,
   StyledSlider,
   TheAnswer,
} from "./slider.styles";

const Slider = ({ whosTurn, showVotes }) => {
   const { player, updatePlayer, players } = useContext(PlayerContext);
   const [value, setValue] = useState(50);

   const handleSliderChange = (event) => {
      const newValue = event.target.value;
      setValue(newValue);
   };

   const calculateRatio = (value) => {
      const ratio = value / 100;
      return -ratio * 60 - 15;
   };

   const handleClick = () => {
      updatePlayer({ ...player, guessed: value });
   };

   return (
      <SliderContainer>
         <h1>{showVotes && player.id !== players[whosTurn].id ? `You got ${100 - Math.abs(players[whosTurn].guessed - player.guessed)} points` : value}</h1>
         <SliderInfo>
            <Emoji>🗑️</Emoji>
            <PointsContainer>
               {showVotes &&
                  // eslint-disable-next-line
                  players.map((thisPlayer) => {
                     if (
                        player.id === players[whosTurn].id &&
                        thisPlayer.id !== player.id
                     ) {
                        return (
                           <TheAnswer
                              style={{
                                 left: `${thisPlayer.guessed}%`,
                                 transform: `translate(${calculateRatio(
                                    thisPlayer.guessed
                                 )}%, -150%) rotate(45deg)`,
                                 borderRadius: "30px 30px 0 30px",
                              }}
                           >
                              <p
                                 style={{
                                    color: "Black",
                                    textAlign: "center",
                                    transform: `rotate(-45deg)`,
                                 }}
                              >
                                 {thisPlayer.displayName.slice(0,3)}
                              </p>
                           </TheAnswer>
                        );
                     }
                  })}
               <StyledSlider
                  type="range"
                  min="0"
                  max="100"
                  className="slider"
                  value={value}
                  disabled={player.guessed}
                  onChange={handleSliderChange}
               ></StyledSlider>
               {showVotes && player.id !== players[whosTurn].id && (
                  <TheAnswer
                     style={{
                        backgroundColor: "green",
                        left: `${players[whosTurn].guessed}%`,
                        transform: `translate(${calculateRatio(
                           players[whosTurn].guessed
                        )}%, 50%) rotate(45deg)`,
                        borderRadius: "0 30px 30px 30px",
                     }}
                  >
                     <p
                        style={{
                           textAlign: "center",
                           transform: `rotate(-45deg)`,
                        }}
                     >
                        {players[whosTurn].guessed}
                     </p>
                  </TheAnswer>
               )}
            </PointsContainer>
            <Emoji>🔥</Emoji>
         </SliderInfo>
         <Confirm onClick={handleClick} disabled={player.guessed}>
            Confirm
         </Confirm>
      </SliderContainer>
   );
};

export default Slider;
