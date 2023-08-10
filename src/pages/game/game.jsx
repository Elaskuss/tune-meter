import { useContext, useEffect } from "react";
import { addToDoc, getDoc } from "../../config/firebase/firebase.config";
import { PlayerContext } from "../../context/player.context";
import { getTopTracks } from "../../config/spotify/spotify.config";
import GuessPlayer from "../../components/guess-player/guess-player.component";
import { useState } from "react";
import ShowPoints from "../../components/show-points/show-point";
import WebPlayback from "../../components/WebPlayback/WebPlayback";
import { GameContainer, GuessPlayerContainer, Title } from "./game.styled";

const Game = () => {
   const { player, updateSongs, players, songs, updatePlayer } =
      useContext(PlayerContext);
   const token = sessionStorage.getItem("access_token");
   const [songsLoaded, setSongsLoaded] = useState(false);
   const [showPoints, setShowPoints] = useState(false);
   const [currentRound, setCurrentRound] = useState(0);

   useEffect(() => {
      function deterministicShuffle(sequence, key) {
         let seed = "";
         for (let i = 0; i < 6; i++) {
            seed = seed + key.charCodeAt(i);
         }

         const rng = seededRandom(parseInt(seed, 10));

         const shuffledSequence = sequence.slice();

         for (let i = shuffledSequence.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffledSequence[i], shuffledSequence[j]] = [
               shuffledSequence[j],
               shuffledSequence[i],
            ];
         }
         return shuffledSequence;
      }

      function seededRandom(seed) {
         let x = seed;
         return function () {
            x = (x * 1664525 + 1013904223) % 4294967296; // LCG algorithm
            return x / 4294967296; // Normalized to [0, 1)
         };
      }

      const upploadAllSongsToFirebase = async () => {
         if (player.gameKey) {
            const tracks = await getTopTracks(player);

            if (!player.gameActive) {
               await addToDoc(
                  "lobbies/" + player.gameKey + "/tracks",
                  tracks,
                  updatePlayer,
                  player
               );
            }
         }
      };

      const getAllSongsAndShuffle = async () => {
         const songsObject = await getDoc(
            "lobbies/" + player.gameKey + "/tracks"
         );
         const songsArray = Object.entries(songsObject).map(([key, value]) => {
            return { key, ...value };
         });

         songsArray.sort((a, b) => a.uri - b.uri);
         const newArray = deterministicShuffle(songsArray, player.gameKey);
         updateSongs(newArray);
      };

      if (songsLoaded) {
         getAllSongsAndShuffle();
      } else {
         upploadAllSongsToFirebase();
      }
      // eslint-disable-next-line
   }, [songsLoaded]);

   useEffect(() => {
      const totalLoadedSongs = players.reduce((count, player) => {
         if (player.songsLoaded) {
            return count + 1;
         }
         return count;
      }, 0);

      if (totalLoadedSongs === players.length) {
         setSongsLoaded(true);
      }

      if (player.round > currentRound) {
         setShowPoints(true);
         setTimeout(() => {
            setCurrentRound(player.round);
            setTimeout(() => {
               updatePlayer({ ...player, guessed: false });
            }, 300);
            setTimeout(() => {
               setShowPoints(false);
            }, 400);
         }, 5000);
      }
      // eslint-disable-next-line
   }, [players]);

   return (
      <GameContainer>
         <Title>Whos that Spotify?</Title>
         {showPoints ? (
            <ShowPoints />
         ) : (
            <>
               {!player.guessed ? (
                  <GuessPlayerContainer>
                     {players.map((player) => (
                        <GuessPlayer
                           song={songs[player.round]}
                           key={player.id}
                           playerInfo={player}
                        />
                     ))}
                  </GuessPlayerContainer>
               ) : (
                  <WebPlayback token={token} />
               )}
            </>
         )}
      </GameContainer>
   );
};
export default Game;
