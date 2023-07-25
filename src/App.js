import logo from "./logo.svg";
import "./App.css";
import Index from "./pages/index";
import { Route, Routes } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import { useContext, useEffect, useState } from "react";
import {
   getDoc,
   onDataChange,
   removeDoc,
} from "./config/firebase/firebase.config";
import { PlayerContext } from "./context/player.context";

function App() {
   const [syncDone, setSyncDone] = useState(false);
   const { updatePlayers, player } = useContext(PlayerContext);

   const syncPlayers = async () => {
      onDataChange("players", "gameKey", player.gameKey, updatePlayers);
   };

   useEffect(() => {
      if (player.gameKey !== "" && syncDone === false) {
         setSyncDone(true);
         syncPlayers();
      }
   }, [player]);

   return (
      <Routes>
         <Route path="/" Component={Index} />
         <Route path="/lobby" Component={Lobby} />
      </Routes>
   );
}

export default App;
