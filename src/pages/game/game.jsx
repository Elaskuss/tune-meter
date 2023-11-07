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
import { Chance } from "chance";

const Game = () => {
  const { players, player, updatePlayer, lobby, updateLobby } =
    useContext(PlayerContext);
  const [song, setSong] = useState("");
  const [songs, setSongs] = useState([]);
  const [whosTurn, setWhosTurn] = useState(0);
  const [playerLength, setPlayerLength] = useState(0);
  const [round, setRound] = useState(0);
  const [showVotes, setShowVotes] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [totalGuessed, setTotalGuessed] = useState(0);
  const [catagory, setCatagory] = useState("Top 100");
  const navigate = useNavigate();

  function customShuffle(arrToSort, inputString, scraped = false) {
    const chance = new Chance(inputString);
    let sortedArray = chance.shuffle(arrToSort);
    if (!scraped) {
      sortedArray = sortedArray.filter((song) => song !== "");
    }
    return sortedArray;
  }

  const calculateWhosTurn = () => {
    const modulo = players.length;
    const round = lobby.round + 1;
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
          shuffledSongs = customShuffle(songs, player.gameKey, true);
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
        case "Country":
          songData = await fetchCatagory(1130102843);
          songs = songData.tracks.data.map((song) => song.preview);
          shuffledSongs = customShuffle(songs, player.gameKey);
          setSongs(shuffledSongs);

          break;
        case "Rap":
          songData = await fetchCatagory(11641952984);
          songs = songData.tracks.data.map((song) => song.preview);
          shuffledSongs = customShuffle(songs, player.gameKey);
          setSongs(shuffledSongs);

          break;
        case "K-pop":
          songData = await fetchCatagory(11732036004);
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
        case "80s":
          songData = await fetchCatagory(867825522);
          songs = songData.tracks.data.map((song) => song.preview);
          shuffledSongs = customShuffle(songs, player.gameKey);
          setSongs(shuffledSongs);
          break;
        case "90s":
          songData = await fetchCatagory(878989033);
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
        if (!song.data[0]) {
          const index = songs.indexOf(round);
          if (index > -1) {
            const updatedSongs = [...songs];
            updatedSongs.splice(index, 1);
            setSongs(updatedSongs);
          }
          loadSong();
        }
        console.log(song);
        setSong(song.data[0].preview);
      }
    } else {
      if (songs.length) {
        setSong(songs[round]);
      }
    }
  };

  useEffect(() => {
    loadSong();
    calculateWhosTurn();

    if (round != 0) {
      if (players[whosTurn]?.id !== player.id) {
        let adjustedRange = 20;

        let difference = Math.abs(players[whosTurn]?.guessed - player.guessed);
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

        updatePlayer({
          points: player.points + points,
          guessed: false,
        });
      } else {
        updatePlayer({
          guessed: false,
        });
      }

      const DisplayingPointsAndNextRound = async () => {
        setShowVotes(true);
        await new Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            setShowPoints(true);
            clearTimeout(timeoutId);
            resolve(); // Resolve the promise when the timeout is done
          }, 5000);
        });

        await new Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            setShowPoints(false);
            setShowVotes(false);
            updatePlayer({
              guessedValue: false,
              guessed: false,
            });
            clearTimeout(timeoutId);
            resolve(); // Resolve the promise when the second timeout is done
          }, 5000);
        });
      };
      DisplayingPointsAndNextRound();
    }

    // eslint-disable-next-line
  }, [songs, round]);

  useEffect(() => {
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
    if (totalGuessed === players.length && player.id === lobby.host) {
      updateLobby({ ...lobby, round: lobby.round + 1 });
    }

    // eslint-disable-next-line
  }, [players]);

  useEffect(() => {
    if (round < lobby.round) {
      setRound(lobby.round);
    }
  }, [lobby]);

  return (
    <GameContainer
      style={{
        minHeight: `${document.documentElement.clientHeight}px`,
      }}
    >
      {showPoints ? (
        <ShowPoints></ShowPoints>
      ) : (
        <>
          {players[whosTurn] && players[whosTurn]?.id !== player.id ? (
            <Title>
              Guess how {players[whosTurn].displayName} rates the song?
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
                Waiting for {players.length - totalGuessed + " "}
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
