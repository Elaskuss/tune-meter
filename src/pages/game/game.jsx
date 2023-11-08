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
import { getDoc } from "../../config/firebase/realtime_database";
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
  const [pointsAdded, setPointsAdded] = useState(false);
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
          //songs = await getSongs();
          //shuffledSongs = customShuffle(songs, player.gameKey, true);
          //setSongs(shuffledSongs);
          songData = await fetchCatagory(3155776842);
          songs = songData.tracks.data.map((song) => song.preview);
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
          songs[lobby.round].title,
          songs[lobby.round].artist.split(" ")[0]
        );
        if (!song.data[0]) {
          const index = songs.indexOf(lobby.round);
          if (index > -1) {
            const updatedSongs = [...songs];
            updatedSongs.splice(index, 1);
            setSongs(updatedSongs);
          }
          loadSong();
        }
        setSong(song.data[0].preview);
      }
    } else {
      if (songs.length) {
        setSong(songs[lobby.round]);
      }
    }
  };

  useEffect(() => {
    if (player.gameKey !== "") {
      localStorage.setItem("gameKey", player.gameKey);
      localStorage.setItem("catagory", player.catagory);
      localStorage.setItem("displayName", player.displayName);
      localStorage.setItem("points", player.points);
    }
    console.log(round);
    if (round === 0) {
      loadSong();
      calculateWhosTurn();
    } else {
      if (players[whosTurn]?.id !== player.id && !player.reconnect) {
        console.log(player.reconnect);
        let adjustedRange = 20;

        let difference = Math.abs(
          players[whosTurn]?.guessedValue - player.guessedValue
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
          (Math.floor(rawPoints) + (rawPoints % 1 === 0.5 ? 0.5 : 0)) * 10;
        updatePlayer({
          points: player.points + points,
          guessed: false,
        });
        setPointsAdded(true);
      } else {
        updatePlayer({
          guessed: false,
        });
        setPointsAdded(true);
      }
    }

    // eslint-disable-next-line
  }, [songs, round, reconnectDone]);

  useEffect(() => {
    if (!pointsAdded) return;
    const DisplayingPointsAndNextRound = async () => {
      setShowVotes(true);
      await new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          setShowPoints(true);
          loadSong();
          calculateWhosTurn();
          setPointsAdded(false);
          clearTimeout(timeoutId);
          resolve();
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
          setPointsAdded(false);
          clearTimeout(timeoutId);
          resolve();
        }, 5000);
      });
    };
    DisplayingPointsAndNextRound();
    // eslint-disable-next-line
  }, [pointsAdded]);

  useEffect(() => {
    if (players.length === 1) {
      navigate("/");
    }

    if (players.length < playerLength || players.length > playerLength) {
      setSong(false);
      loadSong();
      calculateWhosTurn();
    }

    const host = players.filter((player) => player.id === lobby.host);
    if (host.length === 0 && players.length) {
      if (players[0].id === player.id) {
        updateLobby({ ...lobby, host: player.id });
      }
    }

    setPlayerLength(players.length);

    const totalGuessed = players.reduce((accumulator, player) => {
      if (player.guessed) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);

    setTotalGuessed(totalGuessed);
    if (
      totalGuessed === players.length &&
      player.id === lobby.host &&
      players.length > 0
    ) {
      updateLobby({ ...lobby, round: lobby.round + 1 });
    }

    // eslint-disable-next-line
  }, [players]);

  useEffect(() => {
    if (round < lobby.round) {
      setRound(lobby.round);
    }
    // eslint-disable-next-line
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
