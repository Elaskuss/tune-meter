import { useEffect } from "react";
import { useState } from "react";
import { FormStyle } from "./game-form.styles";
import { createGame, getDoc, setDoc } from "../../config/firebase/firebase.config";

const GameForm = ({ promt, type }) => {

    const defaultFormFields = {
        gameKey: "",
        username: "",
    }

    const [formFields, setFormFields] = useState(defaultFormFields);

    useEffect(() => {
        setFormFields(defaultFormFields);
    }, [type])

    const handleChange = (event) => {
        const value = event.target.value;
        setFormFields({
            ...formFields,
            [event.target.name]: value,
        })
    }

    const joinGame = () => {
        console.log("Works2");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(type === "hidden"){
            createGame();
        }
        else{
            joinGame();
        }
    }

    return (
        <FormStyle onSubmit={handleSubmit}>
            <input type={type} placeholder="Game Key" value={formFields.gameKey} onChange={handleChange} name="gameKey" />
            <input type="text" placeholder="Username" value={formFields.username} onChange={handleChange} name="username" />
            <button>{promt}</button>
        </FormStyle>
    )
}

export default GameForm;