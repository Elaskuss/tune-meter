import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../context/player.context";
import {
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
    const [transformLeft, setTransformLeft] = useState(50);
    

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
            <h1>{value}</h1>
            <SliderInfo>
                <Emoji>🗑️</Emoji>
                <PointsContainer>
                    {/* {showVotes &&
                        players.map((player) => {
                            if (player.id != players[whosTurn].id) {
                                return (
                                    <TheAnswer
                                        style={{
                                            left: `${player.guessed}%`,
                                            transform: `translate(${calculateRatio(player.guessed)}%, -150%) rotate(45deg)`,
                                            borderRadius: "30px 30px 0 30px",
                                        }}
                                    ></TheAnswer>
                                );
                            }
                        })} */}
                    <StyledSlider
                        type="range"
                        min="0"
                        max="100"
                        className="slider"
                        value={value}
                        disabled={player.guessed}
                        onChange={handleSliderChange}
                    ></StyledSlider>
                    {showVotes && (
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
            <button onClick={handleClick} disabled={player.guessed}>
                Confirm
            </button>
        </SliderContainer>
    );
};

export default Slider;
