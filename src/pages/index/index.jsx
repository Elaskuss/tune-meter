import { useState } from "react";
import { NavOptionContainer, PageContainer } from "./index.styles";
import NavOption from "../../components/nav-button/nav-option.component";
import { useEffect } from "react";
import GameForm from "../../components/game-form/game-form.component";
import { setDoc } from "../../config/firebase/firebase.config";
import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { useNavigate } from "react-router-dom";
import {
   getProfile,
   requestSpotifyAccessToken,
   requestUserAuthorization,
} from "../../config/spotify/spotify.config";

const Index = () => {
   const { player } = useContext(PlayerContext);
   const [joinGame, setJoinGame] = useState("join");
   const navigate = useNavigate();

   useEffect(() => {
      //This is used to grab the access_code from spotify
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code && !sessionStorage.getItem("access_token")) {
         handleTokenFetch(code);
      }

      if (player.id) {
         setDoc(`players/${player.id}`, { ...player, gameKey: "" });
      }

      if (document.querySelector(".join")) {
         document.querySelector(".join").classList.add("selected");
      }

      //This one is needed to clear the URL code
      navigate("/");
   }, []);

   const handleTokenFetch = async (code) => {
      await requestSpotifyAccessToken(code);
      //This one is needed to make sure that the token has gotten a change to be put into SessionStorage
      navigate("/");
   }

   const handleClick = (event) => {
      setJoinGame(event.target.value);
      if (event.target.value === "join") {
         document.querySelector(".join").classList.add("selected");
         document.querySelector(".host").classList.remove("selected");

         getProfile();
      } else {
         document.querySelector(".host").classList.add("selected");
         document.querySelector(".join").classList.remove("selected");
      }
   };

   const handleSpotifyLogin = (event) => {
      requestUserAuthorization();
   };

   return (
      <PageContainer>
         {!sessionStorage.getItem("access_token") ? (
            <div>
               <h1>This games requires access to your Spotify</h1>
               <button onClick={handleSpotifyLogin}>Log In With Spotify</button>
            </div>
         ) : (
            <div>
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
            </div>
         )}
      </PageContainer>
   );
};

export default Index;
