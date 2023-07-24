import { useState } from "react";
import { NavOptionContainer } from "./index.styles";
import NavOption from "../../components/nav-button/nav-option.component";
import { useEffect } from "react";
import GameForm from "../../components/game-form/game-form.component";

const Index = () => {
   const [joinGame, setJoinGame] = useState("join");
   
    useEffect(() => {
         localStorage.clear();
        document.querySelector(".join").classList.add("selected");
    }, [])
    
    const handleClick = (event) => {
        setJoinGame(event.target.value);
        console.log(event.target);
        if(event.target.value === "join"){
            document.querySelector(".join").classList.add("selected")
            document.querySelector(".host").classList.remove("selected")
        }else{
            document.querySelector(".host").classList.add("selected")
            document.querySelector(".join").classList.remove("selected")
        }
    } 

    return (
        <div>
            <NavOptionContainer>
                <NavOption value={"join"} promt={"Join Game"} className="join" onClick={handleClick}/>
                <NavOption value={"host"} promt={"Host Game"} className="host" onClick={handleClick}/>
            </NavOptionContainer>
            {joinGame === "join" ? <GameForm type={"text"} promt={"Join"}/> : <GameForm type={"hidden"} promt={"Create Game"}/> }
        </div>
    );
}

export default Index