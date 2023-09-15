import React, { createContext, useReducer } from "react";
import { setDoc } from "../config/firebase/realtime_database.js";

export const PlayerContext = createContext();

const INITIAL_STATE = {
   players: [0],
   player: {
      displayName: "",
      gameKey: "",
      id: "",
      status: "Not Ready",
      points: 0,
      disconnected: false,
      guessed: false,
      round: 0,
      catagory: "Top 100",
   },
   songs: [false],
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
         };
      case "UPDATE_SONGS":
         return {
            ...state,
            songs: action.payload,
         };
      default:
         return state;
   }
};

export const PlayerProvider = ({ children }) => {
   const [{ players, player, songs, spotifyPlayer }, dispatch] = useReducer(
      playersReducer,
      INITIAL_STATE
   );

   const updatePlayers = (players) => {
      dispatch({ type: "UPDATE_PLAYERS", payload: players });
   };

   const updatePlayer = (player) => {
      dispatch({ type: "UPDATE_PLAYER", payload: player });
      setDoc(`players/${player.id}`, player);
   };

   const updateSongs = (newSongs) => {
      dispatch({ type: "UPDATE_SONGS", payload: newSongs });
   };

   const updateSpotifyPlayer = (spotifyPlayer) => {
      dispatch({ type: "UPDATE_SPOTIFY_PLAYER", payload: spotifyPlayer });
   };

   const value = {
      updatePlayers,
      updatePlayer,
      updateSongs,
      updateSpotifyPlayer,
      players,
      player,
      songs,
      spotifyPlayer,
   };

   return (
      <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
   );
};
