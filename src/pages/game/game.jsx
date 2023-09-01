import { useContext, useEffect, useState } from "react";
import { GameContainer, Title } from "./game.styled";
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
      if(songs.length){
         const song = await fetchSong(
            songs[round].title,
            songs[round].artist.split(" ")[0]
         );
         setSong(song.data[0].preview);
      }
   };

   useEffect(() => {
      loadSong();
      calculateWhosTurn();
      // eslint-disable-next-line
   }, [songs, round]);

   useEffect(() => {
      const totalGussed = players.reduce((accumulator, player) => {
         if (player.guessed) {
            return accumulator + 1;
         }

         return accumulator;
      }, 0);

      const playerRoundUpdated = players.filter(
         (player) => player.round > round
      ).length;

      if (playerRoundUpdated === players.length) {
         setPointsAdded(false);
         setShowVotes(true);
         setTimeout(() => {
            setShowPoints(true);
            setRound(player.round); 
         }, 1500);
         setTimeout(() => {
            setShowPoints(false);
            setShowVotes(false);
            updatePlayer({ ...player, guessed: false });

         }, 5000);
      }

      if (totalGussed === players.length && !pointsAdded) {
         setPointsAdded(true);
         if (players[whosTurn].id !== player.id) {
            const points =
               100 - Math.abs(players[whosTurn].guessed - player.guessed);
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
               {players.length > 0 && (
                  <Title>
                     How does {players[whosTurn].displayName} rate it?
                  </Title>
               )}
               <Slider whosTurn={whosTurn} showVotes={showVotes}></Slider>
               {/* <GuessPlayerContainer>
                     {players.map((player) => (
                        <GuessPlayer
                           song={songs[player.round]}
                           key={player.id}
                           playerInfo={player}
                        />
                     ))}
                  </GuessPlayerContainer> */}
               {song && <AudioPlayer audioUrl={song}></AudioPlayer>}
            </>
         )}
      </GameContainer>
   );
};
export default Game;
