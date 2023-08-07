import "./App.css";
import Index from "./pages/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import { useContext } from "react";
import { PlayerContext } from "./context/player.context";
import Game from "./pages/game/game";
import { useEffect } from "react";
import { requestSpotifyAccessToken } from "./config/spotify/spotify.config";

function App() {
   const navigate = useNavigate();
   const { player } = useContext(PlayerContext);
   const refresh_token = sessionStorage.getItem("refresh_token");
   const token_expires = localStorage.getItem("token_expires");

   useEffect(() => {
      const popstateHandler = () => {
         navigate("/", { replace: true });
      };
      window.addEventListener("popstate", popstateHandler);
      return () => {
         window.removeEventListener("popstate", popstateHandler);
      };
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (player.gameKey === "") {
         navigate("/", { replace: true });
      }
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      const currentTime = new Date();
      const timeUntilRefresh = token_expires - currentTime - 600000;
      setTimeout(() => {
         requestSpotifyAccessToken(refresh_token, true)
      }, timeUntilRefresh);
      // eslint-disable-next-line
   }, []);

   return (
      <Routes>
         <Route path="/" Component={Index} />
         <Route path="/lobby" Component={Lobby} />
         <Route path="/game" Component={Game} />
      </Routes>
   );
}

export default App;
