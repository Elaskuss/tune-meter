import { useContext } from "react";
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { updatePlayer, updatePlayers, updateLobby, players } =
    useContext(PlayerContext);

  const defaultFormFields = {
    gameKey: "",
    username: "",
  };

  const thrownErrors = {
    gameKeyError: false,
    gameAlreadyActive: false,
    usernameError: false,
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [throwError, setThrowError] = useState(thrownErrors);

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
      const host = true;
      const gameKey = await createGame();
      await joinGame(
        gameKey,
        formFields.username.toLocaleUpperCase(),
        updatePlayer,
        updatePlayers,
        updateLobby,
        host
      );
      navigate("/lobby");
    } else {
      try {
        await joinGame(
          formFields.gameKey.toLocaleUpperCase(),
          formFields.username.toLocaleUpperCase(),
          updatePlayer,
          updatePlayers,
          updateLobby
        );
        navigate("/lobby");
      } catch (error) {
        if (error.message === "Username is already in use") {
          errorHandler("usernameError");
        }
        if (error.message === "Game is already active") {
          errorHandler("gameAlreadyActive");
        }
        if (error.message === "Game not found") {
          errorHandler("gameKeyError");
        }
      }
    }
    setIsLoading(false);
  };

  const handleReconnect = async () => {
    reconnectGame(
      {
        displayName: localStorage.getItem("displayName"),
        gameKey: localStorage.getItem("gameKey"),
        points: localStorage.getItem("points"),
        reconnect: true,
      },
      updatePlayer,
      updatePlayers,
      updateLobby
    );
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
      {throwError.gameAlreadyActive && (
        <ErrorMessage error={"Game has already started"} />
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
        maxLength="12"
        required
      />
      <LobbyButton disabled={isLoading}>{promt}</LobbyButton>
      {players.length < -2 && (
        <LobbyButton type="button" onClick={handleReconnect}>
          Reconnect
        </LobbyButton>
      )}
    </FormStyle>
  );
};

export default GameForm;
