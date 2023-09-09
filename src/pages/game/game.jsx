import { useContext, useEffect, useState } from "react";
import {
    GameContainer,
    Spinner,
    Title,
    WaitingForContainer,
} from "./game.styled";
import { getSongs } from "../../config/firebase/firestore";
import { fetchSong } from "../../config/api/api";
import AudioPlayer from "../../components/audio-player/audio-player.component";
import Slider from "../../components/slider/slider.component";
import { PlayerContext } from "../../context/player.context";
import ShowPoints from "../../components/show-points/show-point";

const Game = () => {
    const { players, player, updatePlayer } = useContext(PlayerContext);
    const [song, setSong] = useState("");
    const [songs, setSongs] = useState([]);
    const [whosTurn, setWhosTurn] = useState(0);
    const [round, setRound] = useState(0);
    const [showVotes, setShowVotes] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(false);
    const [totalGuessed, setTotalGuessed] = useState(0);

    function customShuffle(array, code) {
        const seed = code
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const shuffledArray = [];

        for (let i = array.length - 1; i > -1; i--) {
            const j = Math.floor((seed + i) % (i + 1));
            shuffledArray.push(array[j]);
        }

        return shuffledArray;
    }

    const calculateWhosTurn = () => {
        const modulo = players.length;
        const round = player.round + 1;
        const whosTurn = round % modulo;

        setWhosTurn(whosTurn);
    };

    const loadSong = async () => {
        if (!songs.length) {
            const songs = await getSongs();
            const shuffledSongs = customShuffle(songs, player.gameKey);
            setSongs(shuffledSongs);
        }
        if (songs.length) {
            const song = await fetchSong(
                songs[round].title,
                songs[round].artist.split(" ")[0]
            );
            console.log(song.data[0]);
            setSong(song.data[0].preview);
        }
    };

    useEffect(() => {
        setSong(false);
        loadSong();
        calculateWhosTurn();
        // eslint-disable-next-line
    }, [songs, round]);

    useEffect(() => {
        const totalGuessed = players.reduce((accumulator, player) => {
            if (player.guessed) {
                return accumulator + 1;
            }
            return accumulator;
        }, 0);

        setTotalGuessed(totalGuessed);

        const playerRoundUpdated = players.filter(
            (player) => player.round > round
        ).length;

        if (playerRoundUpdated === players.length) {
            setPointsAdded(false);
            setShowVotes(true);
            setTimeout(() => {
                setShowPoints(true);
                setRound(player.round);
            }, 5000);
            setTimeout(() => {
                setShowPoints(false);
                setShowVotes(false);
                updatePlayer({ ...player, guessed: false });
            }, 5000);
        }

        if (totalGuessed === players.length && !pointsAdded) {
            setPointsAdded(true);
            if (players[whosTurn].id !== player.id) {
                let adjustedRange = 20;

                let difference = Math.abs(
                    players[whosTurn].guessed - player.guessed
                );
                let rawPoints = 0;

                if (difference <= adjustedRange) {
                    rawPoints =
                        -0.001 * Math.pow(difference, 3) +
                        0.055 * Math.pow(difference, 2) -
                        1.15 * difference +
                        10;
                }

                const points =
                    (Math.floor(rawPoints) +
                        (rawPoints % 1 === 0.5 ? 0.5 : 0)) *
                    10;

                updatePlayer({
                    ...player,
                    points: player.points + points,
                    round: player.round + 1,
                });
            } else {
                updatePlayer({ ...player, round: player.round + 1 });
            }
        }
        // eslint-disable-next-line
    }, [players]);

    return (
        <GameContainer>
            {showPoints ? (
                <ShowPoints></ShowPoints>
            ) : (
                <>
                    {players[whosTurn].id !== player.id ? (
                        <Title>
                            Guess how {players[whosTurn].displayName} rates the
                            song?
                        </Title>
                    ) : (
                        <Title>How do you rate the song?</Title>
                    )}
                    <Slider whosTurn={whosTurn} showVotes={showVotes}></Slider>
                    {song ? (
                        <AudioPlayer audioUrl={song}></AudioPlayer>
                    ) : (
                        <>
                            <Spinner>
                                <div className="loader"></div>
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
                    <WaitingForContainer>
                        {players.length === totalGuessed ? (
                            <h2>Prepare for next round...</h2>
                        ) : (
                            <h2>
                                Waiting for{" "}
                                {players.length - totalGuessed + " "}
                                players to guess
                            </h2>
                        )}
                    </WaitingForContainer>
                </>
            )}
        </GameContainer>
    );
};
export default Game;
