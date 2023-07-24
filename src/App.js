import logo from "./logo.svg";
import "./App.css";
import Index from "./pages/index";
import { Route, Routes } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import { useContext, useEffect } from "react";
import { getDoc, onDataChange } from "./config/firebase/firebase.config";
import { PlayerContext } from "./context/player.context";


function App() {
   const {updatePlayers, players} = useContext(PlayerContext);
   const gameKey = localStorage.getItem("gameKey");
   // const id = JSON.parse(localStorage.getItem("player")).id;

   const getPlayers = async () => {
      const gameKey = localStorage.getItem("gameKey");
      // const player = await getDoc("players/8400116b-c59a-44d1-af65-5c78917e7dd1");
      // console.log(player);
      await onDataChange();
   }

   useEffect(() => {
      if(gameKey !== null){
         getPlayers();
      }

   }, [gameKey]);


   return (
      <Routes>
         <Route path="/" Component={Index} />
         <Route path="/lobby" Component={Lobby} />
      </Routes>
   );
}

export default App;
