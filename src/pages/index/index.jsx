import { useContext, useState } from "react";
import { NavOptionContainer, PageContainer } from "./index.styles";
import NavOption from "../../components/nav-button/nav-option.component";
import { useEffect } from "react";
import GameForm from "../../components/game-form/game-form.component";
import { updateDoc } from "../../config/firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import {
   requestSpotifyAccessToken,
   requestUserAuthorization,
} from "../../config/spotify/spotify.config";
import SpotifyLogInButton from "../../components/spotify-log-in-button/spotify-log-in-button.component";
import { PlayerContext } from "../../context/player.context";

const Index = ({autoPlay}) => {
   const [joinGame, setJoinGame] = useState("join");
   const navigate = useNavigate();
   const {spotifyPlayer} = useContext(PlayerContext);
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
      if (event.target.value === "join") {
         document.querySelector(".join").classList.add("selected");
         document.querySelector(".host").classList.remove("selected");
      } else {
         document.querySelector(".host").classList.add("selected");
         document.querySelector(".join").classList.remove("selected");
      }
   };

   const handleSpotifyLogin = () => {
      requestUserAuthorization();
   };

   const handleAutoPlay = () => {
      spotifyPlayer.activateElement();
   }

   return (
      <PageContainer>
         {!access_token ? (
            <>
               <h1>This games requires access to your Spotify</h1>
               <h2>YOU NEED PREMIUM</h2>
               <SpotifyLogInButton
                  handleEvent={handleSpotifyLogin}
                  promt={"Log In With Spotify"}
               />
            </>
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
               </NavOptionContainer>

               {joinGame === "join" ? (
                  <GameForm type={"text"} promt={"Join"} />
               ) : (
                  <GameForm type={"hidden"} promt={"Create Game"} />
               )}
            </>
         )}
         {autoPlay && <button onClick={handleAutoPlay}>ACTIVATE AUTOPLAY</button>}
      </PageContainer>
   );
};

export default Index;
