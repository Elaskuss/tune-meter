import React, { createContext, useReducer } from "react";
import { setDoc } from "../config/firebase/realtime_database.js";

export const PlayerContext = createContext();

const INITIAL_STATE = {
  players: [],
  player: {
    displayName: "",
    gameKey: "",
    id: "",
    status: "Not Ready",
    points: 0,
    guessed: false,
    guessedValue: false,
    online: false,
    catagory: "Top 100",
  },
  songs: [false],
  lobby: {
    round: 0,
    host: "",
    gameKey: "",
    canJoin: true,
  },
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
    case "UPDATE_LOBBY":
      return {
        ...state,
        lobby: action.payload,
      };
    default:
      return state;
  }
};

export const PlayerProvider = ({ children }) => {
  const [{ players, player, songs, lobby }, dispatch] = useReducer(
    playersReducer,
    INITIAL_STATE
  );

  const updatePlayers = (newPlayers) => {
    const updatedPlayers = newPlayers.map((newPlayer) => {
      const matchingExistingPlayerIndex = players.findIndex(
        (existingPlayer) => existingPlayer.id === newPlayer.id
      );

      if (matchingExistingPlayerIndex !== -1) {
        return { ...players[matchingExistingPlayerIndex], ...newPlayer };
      } else {
        return newPlayer;
      }
    });

    dispatch({ type: "UPDATE_PLAYERS", payload: updatedPlayers });
  };

  const updatePlayer = async (updatedFields) => {
    const updatedPlayer = { ...player, ...updatedFields };
    dispatch({ type: "UPDATE_PLAYER", payload: updatedPlayer });
    await setDoc(`players/${updatedPlayer.id}`, updatedPlayer);
    return updatedPlayer;
  };

  const updateSongs = (newSongs) => {
    dispatch({ type: "UPDATE_SONGS", payload: newSongs });
  };

  const updateLobby = async (lobby) => {
    dispatch({ type: "UPDATE_LOBBY", payload: lobby });
    await setDoc(`lobbies/${lobby.gameKey}`, lobby);
  };

  const value = {
    updatePlayers,
    updatePlayer,
    updateSongs,
    updateLobby,
    players,
    player,
    songs,
    lobby,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
