import Index from "./pages/index/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import Game from "./pages/game/game";
import { useContext } from "react";
import { PlayerContext } from "./context/player.context";
import { removeDoc } from "./config/firebase/realtime_database";
import { useEffect } from "react";
import { fetchSong } from "./config/api/api";

function App() {
    const navigate = useNavigate();
    const { player } = useContext(PlayerContext);

    window.addEventListener("beforeunload", function () {
        if (player.id) {
            removeDoc(`players/${player.id}`);
        }
    });

    useEffect(() => {
        if(!player.id){
            //The fetch is to spin up the servers on first time enter so it dosent slow down the page.
            fetchSong("Kick Back", "Kenshi")
            navigate("/");
        }
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/lobby" Component={Lobby} />
                <Route path="/game" Component={Game} />
            </Routes>
        </>
    );
}

export default App;
