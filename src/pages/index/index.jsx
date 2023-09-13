import {useState } from "react";
import { Border, NavOptionContainer, PageContainer } from "./index.styles";
import NavOption from "../../components/nav-button/nav-option.component";
import GameForm from "../../components/game-form/game-form.component";
import { useEffect } from "react";
import { removeDoc } from "../../config/firebase/realtime_database";
import { useNavigate } from "react-router-dom";


const Index = () => {
    const [joinGame, setJoinGame] = useState("join");
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem(("id"))){
            removeDoc(`/player/${localStorage.getItem(("id"))}`)
            navigate("/")
            localStorage.removeItemo("id");
        }
        // eslint-disable-next-line
    }, [])

    const handleClick = (event) => {
        setJoinGame(event.target.value);
        const border = document.querySelector(".border");
        if (event.target.value === "join") {
            border.classList.add("join");
            border.classList.remove("host");
        } else {
            border.classList.add("host");
            border.classList.remove("join");
        }
    };

    return (
            <PageContainer>
                <NavOptionContainer>
                    <NavOption
                        value={"join"}
                        promt={"Join Game"}
                        className="join"
                        onClick={handleClick}
                    />
                    <NavOption
                        value={"host"}
                        promt={"Host Game"}
                        className="host"
                        onClick={handleClick}
                    />
                    <Border className="border"></Border>
                </NavOptionContainer>

                {joinGame === "join" ? (
                    <GameForm type={"text"} promt={"Join"} />
                ) : (
                    <GameForm type={"hidden"} promt={"Create Room"} />
                )}
            </PageContainer>
    );
};

export default Index;
