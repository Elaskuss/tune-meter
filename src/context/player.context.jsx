import React, { createContext, useReducer } from "react";
import { setDoc } from "../config/firebase/firebase.config";

export const PlayerContext = createContext();

const INITIAL_STATE = {
   players: [],
   player: {
      displayName: "",
      gameKey: "",
      id: "",
      status: "NOT READY",
      points: 0,
      disconnected: false,
      songsLoaded: false,
      guessed: false,
      round: 0,
   },
   songs: [false],
   spotifyPlayer: null,
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
      case "UPDATE_SPOTIFY_PLAYER":
         return {
            ...state,
            spotifyPlayer: action.payload,
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
