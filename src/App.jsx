import Index from "./pages/index/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import { useContext } from "react";
import { PlayerContext } from "./context/player.context";
import Game from "./pages/game/game";
import { useEffect } from "react";
import {
   getLobbyTrack,
   requestSpotifyAccessToken,
   spotifyApi,
   startPlayback,
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
   const [mute, setMute] = useState(false);
   const [autoPlayFailed, setAutoPlayFailed] = useState(false);
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
               volume: 0,
               enableMediaSession: true,
            });

            player.addListener("ready", async ({ device_id }) => {
               transferPlayback(token, device_id).then(() => {
                  setTimeout(() => {
                     getLobbyTrack(token).then(track => {
                        const body = JSON.stringify({
                           uris: [track.uri],
                           position_ms: 0,
                           play: true,
                        });
                        startPlayback(token, body).then(() => {
                           setTimeout(() => {
                              player.setVolume(0.5);
                           }, 500)
                        });
                     });
                  }, 200)
               })

            });

            player.addListener("not_ready", ({ device_id }) => {
               console.log("Device ID has gone offline", device_id);
            });

            player.addListener('autoplay_failed', (state) => {
               setAutoPlayFailed(true);
             });

            player.connect().then((success) => {
               if (success) {
                  updateSpotifyPlayer(player);
               }
            });
         };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [token]);

   useEffect(() => {
      const currentTime = new Date();
      const timeUntilRefresh = token_expires - currentTime - 600000;
      setTimeout(() => {
         requestSpotifyAccessToken(refresh_token, true);
      }, timeUntilRefresh);
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (spotifyPlayer) {
         setTimeout(() => {
            if (mute) {
               spotifyApi(spotifyPlayer.setVolume(0));
            } else {
               spotifyApi(spotifyPlayer.setVolume(0.2));
            }
         }, 200);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [mute]);

   const muteHandler = () => {
      setMute(!mute);
   };

   return (
      <>
         {token && (
            <div id="volume">
               {mute ? (
                  <Mute onClick={muteHandler} />
               ) : (
                  <Volume onClick={muteHandler} />
               )}
            </div>
         )}
         <Routes>
            <Route path="/" element={<Index autoPlayFailed={autoPlayFailed}/>} />
            <Route path="/lobby" Component={Lobby} />
            <Route path="/game" Component={Game} />
         </Routes>
      </>
   );
}

export default App;
