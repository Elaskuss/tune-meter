import { useContext, useEffect } from "react";
import { useState } from "react";
import { FormStyle, InputStyle, LobbyButton } from "./game-form.styles";
import {
   createGame,
   joinGame,
   reconnectGame,
} from "../../config/firebase/realtime_database.js";
import ErrorMessage from "../error-message/error-message.component";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";

const GameForm = ({ promt, type }) => {
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();
   const { updatePlayer, updatePlayers } = useContext(PlayerContext);
   let reconnectPlayer = {};
   if (sessionStorage.getItem("player")) {
      reconnectPlayer = JSON.parse(sessionStorage.getItem("player"));
   }

   const defaultFormFields = {
      gameKey: "",
      username: "",
   };

   const thrownErrors = {
      gameKeyError: false,
      usernameError: false,
   };

   const [formFields, setFormFields] = useState(defaultFormFields);
   const [throwError, setThrowError] = useState(thrownErrors);

   useEffect(() => {
      setFormFields(defaultFormFields);
      // eslint-disable-next-line
   }, []);

   const handleChange = (event) => {
      const value = event.target.value;
      setFormFields({
         ...formFields,
         [event.target.name]: value,
      });
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      if (type === "hidden") {
         await createGame(formFields.username, updatePlayer, updatePlayers);
         navigate("/lobby");
      } else {
         try {
            await joinGame(
               formFields.gameKey.toLocaleUpperCase(),
               formFields.username,
               updatePlayer,
               updatePlayers
            );
            navigate("/lobby");
         } catch (error) {
            if (error.message === "Username is already in use") {
               errorHandler("usernameError");
            }
            if (error.message === "Game not found") {
               errorHandler("gameKeyError");
            }
         }
      }
      setIsLoading(false);
   };

   const handleReconnect = async () => {
      await reconnectGame(reconnectPlayer, updatePlayer, updatePlayers);
      navigate("/game");
   };

   const errorHandler = (error) => {
      setThrowError({
         [error]: true,
      });

      setTimeout(() => {
         setThrowError({
            [error]: false,
         });
      }, 3000);
   };

   return (
      <FormStyle onSubmit={handleSubmit}>
         {throwError.gameKeyError && (
            <ErrorMessage error={"The game can not be found"} />
         )}
         <InputStyle
            type={type}
            placeholder="Game Key"
            value={formFields.gameKey}
            onChange={handleChange}
            name="gameKey"
         />
         {throwError.usernameError && (
            <ErrorMessage error={"Username is already in use"} />
         )}
         <InputStyle
            type="text"
            placeholder="Username"
            value={formFields.username}
            onChange={handleChange}
            name="username"
            maxlength="12"
            required
         />
         <LobbyButton disabled={isLoading}>{promt}</LobbyButton>
         {reconnectPlayer.gameActive && (
            <LobbyButton type="button" onClick={handleReconnect}>
               Reconnect
            </LobbyButton>
         )}
      </FormStyle>
   );
};

export default GameForm;
