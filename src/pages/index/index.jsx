import { useContext, useState } from "react";
import {
   AutoPlay,
   AutoPlayContainer,
   Border,
   NavOptionContainer,
   PageContainer,
   SpotifyAccess,
} from "./index.styles";
import NavOption from "../../components/nav-button/nav-option.component";
import { useEffect } from "react";
import GameForm from "../../components/game-form/game-form.component";
import { updateDoc } from "../../config/firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import {
   getLobbyTrack,
   requestSpotifyAccessToken,
   requestUserAuthorization,
   spotifyApi,
   startPlayback,
} from "../../config/spotify/spotify.config";
import SpotifyLogInButton from "../../components/spotify-log-in-button/spotify-log-in-button.component";
import { PlayerContext } from "../../context/player.context";

const Index = ({ autoPlayFailed }) => {
   const [joinGame, setJoinGame] = useState("join");
   const navigate = useNavigate();
   const { spotifyPlayer } = useContext(PlayerContext);
   const [autoPlayActive, setAutoPlayActive] = useState(false);
   const access_token = sessionStorage.getItem("access_token");

   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code && !access_token) {
         handleTokenFetch(code);
      }

      if (document.querySelector(".join")) {
         document.querySelector(".join").classList.add("selected");
      }

      if (sessionStorage.getItem("id")) {
         updateDoc(`/players/${sessionStorage.getItem("id")}`, { gameKey: "" });
      }
      // eslint-disable-next-line
   }, []);

   const handleTokenFetch = async (code) => {
      await requestSpotifyAccessToken(code);
      //This one is needed to make sure that the token has gotten a change to be put into SessionStorage
      navigate("/");
   };

   const handleClick = (event) => {
      setJoinGame(event.target.value);
      const border = document.querySelector(".border");
      if (event.target.value === "join") {
         border.classList.add("join");
         border.classList.remove("host");
      } else {
         border.classList.add("host");
         border.classList.remove("join");
      }
   };

   const handleSpotifyLogin = () => {
      requestUserAuthorization();
   };

   useEffect(() => {
      if (autoPlayFailed && autoPlayActive && spotifyPlayer) {
         spotifyApi(spotifyPlayer.activateElement()).then(() => {
            getLobbyTrack(access_token).then((track) => {
               const body = JSON.stringify({
                  uris: [track.uri],
                  position_ms: 0,
                  play: true,
               });
               startPlayback(access_token, body).then(() => {
                  spotifyApi(spotifyPlayer.setVolume(0.5));
               });
            });
         });
      }
      // eslint-disable-next-line
   }, [autoPlayFailed, autoPlayActive, spotifyPlayer]);

   const handleAutoPlay = () => {
      setAutoPlayActive(true);
   };

   return (
      <PageContainer>
         {!access_token ? (
            <SpotifyAccess>
               <h1>Log in to spotify</h1>
               <p>
                  This game uses your favorite songs to create a music quiz.{" "}
                  <br />
                  <br />
                  Please Note: <br />
                  It is only playable if you have Spotify premium
               </p>
               <SpotifyLogInButton
                  handleEvent={handleSpotifyLogin}
                  promt={"Log In With Spotify"}
               />
            </SpotifyAccess>
         ) : (
            <>
               {autoPlayFailed && !autoPlayActive ? (
                  <AutoPlayContainer>
                     <div>
                        <h2>Enable Autoplay</h2>
                        <p>
                           This game requires autoplay to function. To ensure it
                           works properly, please enable autoplay by clicking
                           the button below. <br /> <br />
                           OBS! If the game still doesn't work, it could be
                           because you don't have an instance of Spotify open.
                           Make sure to have Spotify open and active (the play
                           button not grayed out) somewhere then refresh this page.
                        </p>
                     </div>
                     <AutoPlay onClick={handleAutoPlay}>
                        Activate Autoplay
                     </AutoPlay>
                  </AutoPlayContainer>
               ) : (
                  <>
                     <NavOptionContainer>
                        <NavOption
                           value={"join"}
                           promt={"Join Game"}
                           className="join"
                           onClick={handleClick}
                        />
                        <NavOption
                           value={"host"}
                           promt={"Host Game"}
                           className="host"
                           onClick={handleClick}
                        />
                        <Border className="border"></Border>
                     </NavOptionContainer>

                     {joinGame === "join" ? (
                        <GameForm type={"text"} promt={"Join"} />
                     ) : (
                        <GameForm type={"hidden"} promt={"Create Game"} />
                     )}
                  </>
               )}
            </>
         )}
      </PageContainer>
   );
};

export default Index;
