import { useContext, useEffect, useState } from "react";
import {
    GameContainer,
    RoundInfo,
    SliderContainer,
    Title,
    WaitingForContainer,
} from "./game.styled";
import { getSongs } from "../../config/firebase/firestore";
import { fetchCatagory, fetchSong } from "../../config/api/api";
import Slider from "../../components/slider/slider.component";
import { PlayerContext } from "../../context/player.context";
import ShowPoints from "../../components/show-points/show-point";
import { getDoc, removeDoc } from "../../config/firebase/realtime_database";
import { useNavigate } from "react-router-dom";

const Game = () => {
    const { players, player, updatePlayer } = useContext(PlayerContext);
    const [song, setSong] = useState("");
    const [songs, setSongs] = useState([]);
    const [whosTurn, setWhosTurn] = useState(0);
    const [playerLength, setPlayerLength] = useState(0);
    const [round, setRound] = useState(0);
    const [showVotes, setShowVotes] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(false);
    const [totalGuessed, setTotalGuessed] = useState(0);
    const [catagory, setCatagory] = useState("Top 100");
    const [skipRoundFallback, setSkipRoundFallback] = useState(0);
    const navigate = useNavigate();

    function customShuffle(array, code) {
      const seed = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const shuffledArray = [...array];
    
      for (let i = array.length - 1; i > -1; i--) {
        const j = Math.floor((seed + i) % (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
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
            const lobby = await getDoc(`lobbies/${player.gameKey}`);
            setCatagory(lobby.catagory);
            let songs;
            let shuffledSongs;
            let songData;
            switch (lobby.catagory) {
                case "Top 100":
                    songs = await getSongs();
                    shuffledSongs = customShuffle(songs, player.gameKey);
                    setSongs(shuffledSongs);

                    break;
                case "Party":
                    songData = await fetchCatagory(11759239561);
                    songs = songData.tracks.data.map((song) => song.preview);
                    shuffledSongs = customShuffle(songs, player.gameKey);
                    setSongs(shuffledSongs);

                    break;
                case "Rock":
                    songData = await fetchCatagory(1306931615);
                    songs = songData.tracks.data.map((song) => song.preview);
                    shuffledSongs = customShuffle(songs, player.gameKey);
                    setSongs(shuffledSongs);

                    break;
                case "00s":
                    songData = await fetchCatagory(248297032);
                    songs = songData.tracks.data.map((song) => song.preview);
                    shuffledSongs = customShuffle(songs, player.gameKey);
                    setSongs(shuffledSongs);

                    break;
                default:
                    songs = await getSongs();
                    shuffledSongs = customShuffle(songs, player.gameKey);
                    setSongs(shuffledSongs);

                    break;
            }
        }
        if (catagory === "Top 100") {
            if (songs.length) {
                const song = await fetchSong(
                    songs[round].title,
                    songs[round].artist.split(" ")[0]
                );
                console.log(song.data[0]);
                if (!song.data[0]) {
                    const index = songs.indexOf(round);
                    if (index > -1) {
                        const updatedSongs = [...songs];
                        updatedSongs.splice(index, 1);
                        setSongs(updatedSongs);
                    }
                    loadSong();
                }
                if (!song) {
                    setSong(songs[songs.length - 1 - skipRoundFallback]);
                    setSkipRoundFallback(skipRoundFallback - 1);
                }
                setSong(song.data[0].preview);
            }
        } else {
            if (songs.length) {
                if (songs[round]) {
                    setSong(songs[round]);
                } else {
                    setSong(songs[songs.length - 1 - skipRoundFallback]);
                    setSkipRoundFallback(skipRoundFallback - 1);
                }
            }
        }
    };

    useEffect(() => {
        setSong(false);
        loadSong();
        calculateWhosTurn();
        // eslint-disable-next-line
    }, [songs, round]);

    useEffect(() => {
        console.log(window.innerHeight);

        if (players.length === 1) {
            removeDoc(`/players/${player.id}`);
            navigate("/");
        }

        if (players.length < playerLength) {
            setSong(false);
            loadSong();
            calculateWhosTurn();
        }

        setPlayerLength(players.length);

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
            const DisplayingPointsAndNextRound = async () => {
                await new Promise((resolve) => {
                    const timeoutId = setTimeout(() => {
                        setShowPoints(true);
                        setRound(player.round);
                        clearTimeout(timeoutId);
                        resolve(); // Resolve the promise when the timeout is done
                    }, 5000);
                });

                await new Promise((resolve) => {
                    const timeoutId = setTimeout(() => {
                        setShowPoints(false);
                        setShowVotes(false);
                        updatePlayer({ ...player, guessed: false });
                        clearTimeout(timeoutId);
                        resolve(); // Resolve the promise when the second timeout is done
                    }, 5000);
                });
            };
            DisplayingPointsAndNextRound();
        }

        if (totalGuessed === players.length && !pointsAdded) {
            setPointsAdded(true);
            if (players[whosTurn]?.id !== player.id) {
                let adjustedRange = 20;

                let difference = Math.abs(
                    players[whosTurn]?.guessed - player.guessed
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
        <GameContainer
            style={{
                minHeight: `${window.innerHeight}px`,
            }}
        >
            {showPoints ? (
                <ShowPoints></ShowPoints>
            ) : (
                <>
                    {players[whosTurn] &&
                    players[whosTurn]?.id !== player.id ? (
                        <Title>
                            Guess how {players[whosTurn].displayName} rates the
                            song?
                        </Title>
                    ) : (
                        <Title>How do you rate the song?</Title>
                    )}
                    <SliderContainer>
                        <Slider
                            whosTurn={whosTurn}
                            song={song}
                            showVotes={showVotes}
                        ></Slider>
                    </SliderContainer>
                    <WaitingForContainer>
                        {players.length === totalGuessed ? (
                            <RoundInfo>Prepare for next round...</RoundInfo>
                        ) : (
                            <RoundInfo>
                                Waiting for{" "}
                                {players.length - totalGuessed + " "}
                                players to guess
                            </RoundInfo>
                        )}
                    </WaitingForContainer>
                </>
            )}
        </GameContainer>
    );
};
export default Game;
