import { useContext, useState } from "react";
import { PlayerContext } from "../../context/player.context";
import {
    Confirm,
    Emoji,
    PointsContainer,
    SliderContainer,
    SliderInfo,
    Spinner,
    StyledSlider,
    TheAnswer,
} from "./slider.styles";
import AudioPlayer from "../audio-player/audio-player.component";

const Slider = ({ whosTurn, showVotes, song }) => {
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

    const calcPoint = () => {
        let adjustedRange = 20;

        let difference = Math.abs(players[whosTurn]?.guessed - player.guessed);
        let rawPoints = 0;

        if (difference <= adjustedRange) {
            rawPoints = -0.001 * Math.pow(difference, 3) + 0.055 * Math.pow(difference, 2) - 1.15 * difference + 10;
        }

        const points =
            (Math.floor(rawPoints) + (rawPoints % 1 === 0.5 ? 0.5 : 0)) * 10;
        return points;
    };

    return (
        <SliderContainer>
            <h1>
                {showVotes && player.id !== players[whosTurn]?.id
                    ? `You got ${calcPoint()} points`
                    : value}
            </h1>
            <SliderInfo>
                <Emoji>🗑️</Emoji>
                <PointsContainer>
                    {showVotes &&
                        // eslint-disable-next-line
                        players.map((thisPlayer) => {
                            if (
                                player.id === players[whosTurn]?.id &&
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
                                            {thisPlayer.displayName.slice(0, 3)}
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
                    {showVotes && player.id !== players[whosTurn]?.id && (
                        <TheAnswer
                            style={{
                                backgroundColor: "green",
                                left: `${players[whosTurn]?.guessed}%`,
                                transform: `translate(${calculateRatio(
                                    players[whosTurn]?.guessed
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
                                {players[whosTurn]?.guessed}
                            </p>
                        </TheAnswer>
                    )}
                </PointsContainer>
                <Emoji>🔥</Emoji>
            </SliderInfo>
            <Confirm onClick={handleClick} disabled={player.guessed}>
                Confirm
            </Confirm>
            {song ? (
                  <AudioPlayer audioUrl={song}></AudioPlayer>
               ) : (
                  <>
                     <Spinner>
                     <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                     </Spinner>
                     <p
                        style={{
                           display: "flex",
                           justifyContent: "center",
                        }}
                     >
                        Loading Audio
                     </p>
                  </>
               )}
        </SliderContainer>
    );
};

export default Slider;
