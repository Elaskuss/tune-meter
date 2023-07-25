import React, { createContext, useReducer } from "react";
import { removeDoc, setDoc } from "../config/firebase/firebase.config";

export const PlayerContext = createContext();

const INITIAL_STATE = {
   players: [],
   player: {
      displayName: "",
      gameKey: "",
      id: "",
      status: "NOT READY",
      points: "",
      disconnected: false,
   }
};

// Define your playersReducer function
const playersReducer = (state, action) => {
   switch (action.type) {
      case "UPDATE_PLAYERS":
         return {
            ...state,
            players: action.payload,
         };
      case "UPDATE_PLAYER":
         return {
            ...state,
            player: action.payload,
         }
      default:
         return state;
   }
};

export const PlayerProvider = ({ children }) => {
   const [{players, player}, dispatch] = useReducer(playersReducer, INITIAL_STATE);

   const updatePlayers = (players) => {
      console.log("update players");
      dispatch({ type: "UPDATE_PLAYERS", payload: players });
   };

   const updatePlayer = (player) => {
      console.log("update one player");
      dispatch({ type: "UPDATE_PLAYER", payload: player });
      setDoc(`players/${player.id}`, player);
   };

   const removePlayer = () => {
      dispatch({ type: "UPDATE_PLAYER", payload: player });
      
      if(player.id !== ""){
         removeDoc(`players/${player.id}`);
      }

      const playersArray = [];
      players.forEach(player => {
         playersArray.push(player.id);
      });
      setDoc(`lobbies/${player.gameKey}/players`, playersArray)
   };

   const value = {
      removePlayer,
      updatePlayers,
      updatePlayer,
      players,
      player,
   };

   return (
      <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
   );
};