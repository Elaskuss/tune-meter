
import Index from "./pages/index/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import { useContext } from "react";
import { PlayerContext } from "./context/player.context";
import Game from "./pages/game/game";
import { useEffect } from "react";
import {
   requestSpotifyAccessToken,
   setVolume,
   transferPlayback,
} from "./config/spotify/spotify.config";
import Mute from "./svg/Mute";
import Volume from "./svg/Volume";
import { useState } from "react";

function App() {
   const navigate = useNavigate();
   const { player, updateSpotifyPlayer, spotifyPlayer } =
      useContext(PlayerContext);
   const refresh_token = sessionStorage.getItem("refresh_token");
   const token_expires = localStorage.getItem("token_expires");
   const [mute, setMute] = useState(true);
   const token = sessionStorage.getItem("access_token");

   useEffect(() => {
      if (player.gameKey === "") {
         navigate("/", { replace: true });
      }
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (sessionStorage.getItem("access_token")) {
         const script = document.createElement("script");
         script.src = "https://sdk.scdn.co/spotify-player.js";
         script.async = true;
         document.body.appendChild(script);

         window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
               name: "Web Playback SDK",
               getOAuthToken: (cb) => {
                  cb(token);
               },
               volume: 0.5,
               enableMediaSession: true,
            });

            player.addListener("ready", async ({ device_id }) => {
               await transferPlayback(token, device_id);
            });

            player.addListener("not_ready", ({ device_id }) => {
               console.log("Device ID has gone offline", device_id);
            });

            player.addListener("player_state_changed", (state) => {
               const current_track = state.track_window.current_track;
               if (current_track) {
                  updateSpotifyPlayer({
                     ...spotifyPlayer,
                     current_track: current_track,
                  });
               }
            });

            player.connect().then((success) => {
               if (success) {
                  console.log(
                     "The Web Playback SDK successfully connected to Spotify!"
                  );
               }
            });
         };
      }
   }, [sessionStorage.getItem("access_token")]);

   useEffect(() => {
      const currentTime = new Date();
      const timeUntilRefresh = token_expires - currentTime - 600000;
      setTimeout(() => {
         requestSpotifyAccessToken(refresh_token, true);
      }, timeUntilRefresh);
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (token) {
         if (mute) {
            setVolume(token, 0);
         } else {
            setVolume(token, 80);
         }
      }
   }, [mute]);

   const muteHandler = () => {
      setMute(!mute);
   };

   return (
      <>
         <div id="volume">
            {mute ? (
               <Mute onClick={muteHandler} />
            ) : (
               <Volume onClick={muteHandler} />
            )}
         </div>
         <Routes>
            <Route path="/" Component={Index} />
            <Route path="/lobby" Component={Lobby} />
            <Route path="/game" Component={Game} />
         </Routes>
      </>
   );
}

export default App;
