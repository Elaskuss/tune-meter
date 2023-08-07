import { useContext, useEffect } from "react";
import {
   addToDoc,
   getDoc,
   getSongs,
   setDoc,
} from "../../config/firebase/firebase.config";
import { PlayerContext } from "../../context/player.context";
import { getPlayerState, getTopTracks } from "../../config/spotify/spotify.config";
import SpotifyPlayer from "react-spotify-web-playback";
import { spotifyApi } from "react-spotify-web-playback";
import GuessPlayer from "../../components/guess-player/guess-player.component";
import { useState } from "react";
import CustomPlayer from "../../components/custom-player/cusom-player.component";
import ShowPoints from "../../components/show-points/show-point";
import WebPlayback from "../../components/WebPlayback/WebPlayback";

const Game = () => {
   const { player, updateSongs, players, songs, updatePlayer } =
      useContext(PlayerContext);
   const token = sessionStorage.getItem("access_token");
   const [songsLoaded, setSongsLoaded] = useState(false);
   const [playerLoaded, setPlayerLoaded] = useState("");
   const [songsToPlay, setSongsToPlay] = useState([]);
   const [currentSong, setCurrentSong] = useState("");
   const [playerState, setPlayerState] = useState({});
   const [showPoints, setShowPoints] = useState(false);
   const [currentRound, setCurrentRound] = useState(0);

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

   useEffect(() => {
      upploadAllSongsToFirebase();
   }, []);

   const getAllSongsAndShuffle = async () => {
      if (songsLoaded) {
         const songsObject = await getDoc(
            "lobbies/" + player.gameKey + "/tracks"
         );
         const songsArray = Object.entries(songsObject).map(([key, value]) => {
            return { key, ...value };
         });

         const newArray = deterministicShuffle(songsArray, player.gameKey);
         updateSongs(newArray);

         sessionStorage.setItem("player", JSON.stringify(player));
      }
   };

   useEffect(() => {
      getAllSongsAndShuffle();
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
         setCurrentRound(player.round);

         console.log(playerLoaded);
         setShowPoints(true);
         setTimeout(async () => {
            setShowPoints(false);
            nextSong(token, playerLoaded);
            updatePlayer({ ...player, guessed: false });
         }, 5000);
      }
   }, [players]);

   const nextSong = async (token) => {
      const playBack = await spotifyApi.getDevices(token);
      console.log(playBack);
      const webPlayer = playBack.devices.find(
         (device) => device.name === "Spotify Web Player"
      );
      console.log(webPlayer);
      try {
         const SpotifyPlayOptions = {
            deviceId: webPlayer.id,
            uris: songsToPlay[player.round],
         };
         await spotifyApi.play(token, SpotifyPlayOptions);
      } catch (error) {
         setTimeout(async () => {
            await spotifyApi.next(token, webPlayer.id);
         }, 500);
      }
   };

   useEffect(() => {
      setSongsToPlay(songs);
   }, [songs]);

   useEffect(() => {
      if (playerLoaded && songsToPlay.length) {
         console.log(getPlayerState(token));
         //nextSong(token)
      }
   }, [playerLoaded, songsToPlay]);

   const handleSpotifyWebPlayerUpdate = async (state) => {
      
      setPlayerState(state);

      if (state.status === "READY") {
         setPlayerLoaded(state.currentDeviceId);
      }
      const currentSong = songs.find((song) => {
         return state.track.name === song.name;
      });

      setCurrentSong(currentSong);

      if (state.isPlaying === true) {
         let volume = 0;
         if (!player.mute) {
            volume = 80;
         }
         spotifyApi.setVolume(token, volume, state.currentDeviceId);
      }
   };

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

   return (
      <div>
         <h1>Whos that Spotify?</h1>
         {showPoints ? (
            <ShowPoints />
         ) : (
            <div hidden={currentSong ? false : true}>
               <div>
                  {players.map((player) => (
                     <GuessPlayer
                        song={currentSong}
                        key={player.id}
                        playerInfo={player}
                     />
                  ))}
               </div>
               <div hidden={!player.guessed}>
                  {currentSong && (
                     <CustomPlayer
                        token={token}
                        song={currentSong}
                        state={playerState}
                     ></CustomPlayer>
                  )}
                  <div hidden={false}>
                     <WebPlayback token={token} />
                     {/* <SpotifyPlayer
                        token={token}
                        callback={handleSpotifyWebPlayerUpdate}
                     /> */}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
export default Game;
