import { useContext, useEffect } from "react";
import { useState } from "react";
import { FormStyle } from "./game-form.styles";
import { createGame, joinGame } from "../../config/firebase/firebase.config";
import ErrorMessage from "../error-message/error-message.component";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/player.context";

const GameForm = ({ promt, type }) => {
   const {updatePlayers} = useContext(PlayerContext);
   const navigate = useNavigate();

   const defaultFormFields = {
      gameKey: "",
      username: "",
      gameKeyError: false,
      usernameError: false,
   };

   const [formFields, setFormFields] = useState(defaultFormFields);

   useEffect(() => {
      setFormFields(defaultFormFields);
   }, [type]);

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
         await createGame(formFields.username, updatePlayers);
         //Here i want to update the context
         navigate("lobby");
      } else {
         try {
            await joinGame(formFields.gameKey, formFields.username, updatePlayers);
            //Here i want to update the context
            navigate("lobby");
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

   const errorHandler = (error) => {
      setFormFields({
         ...formFields,
         [error]: true,
      });

      setTimeout(() => {
         setFormFields({
            ...formFields,
            [error]: false,
         });
      }, 3000);
   };

   return (
      <FormStyle onSubmit={handleSubmit}>
         {formFields.gameKeyError && (
            <ErrorMessage error={"The game can not be found"} />
         )}
         <input
            type={type}
            placeholder="Game Key"
            value={formFields.gameKey}
            onChange={handleChange}
            name="gameKey"
         />
         {formFields.usernameError && (
            <ErrorMessage error={"Username is already in use"} />
         )}
         <input
            type="text"
            placeholder="Username"
            value={formFields.username}
            onChange={handleChange}
            name="username"
         />
         <button>{promt}</button>
      </FormStyle>
   );
};

export default GameForm;
