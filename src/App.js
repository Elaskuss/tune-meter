import "./App.css";
import Index from "./pages/index";
import { Route, Routes } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import { useContext } from "react";
import { PlayerContext } from "./context/player.context";
import Game from "./pages/game/game";
import { useEffect } from "react";

function App() {
   const {updatePlayer, player} = useContext(PlayerContext);

   useEffect(() => {
      updatePlayer({...player, spotify: localStorage.getItem("spotify")})
   }, [])

   return (
         <Routes>
            <Route path="/" Component={Index} />
            <Route path="/lobby" Component={Lobby} />
            <Route path="/game" Component={Game} />
         </Routes>
   );
}

export default App;
