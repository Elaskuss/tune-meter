import { useContext, useEffect } from "react";
import { useState } from "react";
import { FormStyle } from "./game-form.styles";
import { createGame, joinGame, reconnectGame } from "../../config/firebase/firebase.config";
import ErrorMessage from "../error-message/error-message.component";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";


const GameForm = ({ promt, type }) => {
   const navigate = useNavigate();
   const [activePlayers, setActivePlayers] = useState(0);
   const {updatePlayer, updatePlayers, player, players} = useContext(PlayerContext);

   const defaultFormFields = {
      gameKey: "",
      username: "",

   };

   const thrownErrors = {
      gameKeyError: false,
      usernameError: false,
   }

   const [formFields, setFormFields] = useState(defaultFormFields);
   const [throwError, setThrowError] = useState(thrownErrors);

   useEffect(() => {
      setFormFields(defaultFormFields);
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      const activePlayers = players.reduce((active, player)  => {
         if(player.gameKey != ""){
            return active + 1;
         }
         return active
      }, 0);

      setActivePlayers(activePlayers);

   }, [players]);


   const handleChange = (event) => {
      const value = event.target.value;
      setFormFields({
         ...formFields,
         [event.target.name]: value,
      });
   };

   const handleSubmit = async (event) => {
      
      event.preventDefault();

      

      if (type === "hidden") {
         await createGame(formFields.username, updatePlayer, updatePlayers);
         navigate("/lobby");
      } else {
         try {
            await joinGame(formFields.gameKey, formFields.username, updatePlayer, updatePlayers);
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
   };

   const handleReconnect = async () => {
      const player = JSON.parse(sessionStorage.player);
      await reconnectGame(player, updatePlayer, updatePlayers);
      navigate("/lobby");
   }

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
         <input
            type={type}
            placeholder="Game Key"
            value={formFields.gameKey}
            onChange={handleChange}
            name="gameKey"
         />
         {throwError.usernameError && (
            <ErrorMessage error={"Username is already in use"} />
         )}
         <input
            type="text"
            placeholder="Username"
            value={formFields.username}
            onChange={handleChange}
            name="username"
            required
         />
         <button>{promt}</button>
         {player.id && activePlayers > 0 && <button type="button" onClick={handleReconnect}>Reconnect</button>}
      </FormStyle>
   );
};

export default GameForm;
