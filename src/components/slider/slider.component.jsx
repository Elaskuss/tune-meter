import { useContext, useState } from "react";
import { PlayerContext } from "../../context/player.context";
import {
    Confirm,
    Emoji,
    PointsContainer,
    SliderContainer,
    SliderInfo,
    SliderValue,
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
        updatePlayer({guessed: true, guessedValue: value});
    };

    const calcPoint = () => {
        let adjustedRange = 20;

        let difference = Math.abs(players[whosTurn]?.guessedValue - player.guessedValue);
        let rawPoints = 0;

        if (difference <= adjustedRange) {
            rawPoints =
                -0.001 * Math.pow(difference, 3) +
                0.055 * Math.pow(difference, 2) -
                1.15 * difference +
                10;
        }

        const points =
            (Math.floor(rawPoints) + (rawPoints % 1 === 0.5 ? 0.5 : 0)) * 10;
        return points;
    };

    return (
        <SliderContainer>
            <SliderValue>
                {showVotes && player.id !== players[whosTurn]?.id
                    ? `You got ${calcPoint()} points`
                    : value}
            </SliderValue>
            <SliderInfo>
                <Emoji>🗑️</Emoji>
                <PointsContainer>
                    {showVotes &&
                        // eslint-disable-next-line
                        players.map((thisPlayer) => {
                            if (
                                (player.id === players[whosTurn]?.id && player.id !== thisPlayer.id) || (player.id !== players[whosTurn]?.id && player.id !== thisPlayer.id && thisPlayer.id !== players[whosTurn]?.id)
                            ) {
                                return (
                                    <TheAnswer
                                        style={{
                                            left: `${thisPlayer.guessedValue}%`,
                                            transform: `translate(${calculateRatio(
                                                thisPlayer.guessedValue
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
                        disabled={player.guessedValue}
                        onChange={handleSliderChange}
                    ></StyledSlider>
                    {showVotes && player.id !== players[whosTurn]?.id && (
                        <TheAnswer
                            style={{
                                backgroundColor: "green",
                                left: `${players[whosTurn]?.guessedValue}%`,
                                transform: `translate(${calculateRatio(
                                    players[whosTurn]?.guessedValue
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
                                {players[whosTurn]?.guessedValue}
                            </p>
                        </TheAnswer>
                    )}
                </PointsContainer>
                <Emoji>🔥</Emoji>
            </SliderInfo>
            <Confirm onClick={handleClick} disabled={player.guessedValue}>
                Confirm
            </Confirm>
            {song ? (
                <AudioPlayer audioUrl={song}></AudioPlayer>
            ) : (
                <>
                    <Spinner>
                        <div class="lds-ellipsis">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </Spinner>
                </>
            )}
        </SliderContainer>
    );
};

export default Slider;
