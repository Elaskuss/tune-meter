import React, { createContext, useReducer } from "react";

export const PlayerContext = createContext();

const INITIAL_STATE = {
   players: [],
};

// Define your playersReducer function
const playersReducer = (state, action) => {
   switch (action.type) {
      case "UPDATE_PLAYER":
         return {
            ...state,
            players: action.payload,
         };
      default:
         return state;
   }
};

export const PlayerProvider = ({ children }) => {
   const [{players}, dispatch] = useReducer(playersReducer, INITIAL_STATE);

   const updatePlayers = (players) => {
      dispatch({ type: "UPDATE_PLAYER", payload: players });
   };

   const value = {
      updatePlayers,
      players
   };

   return (
      <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
   );
};
