import Index from "./pages/index/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import Game from "./pages/game/game";
import { getSongs } from "./config/firebase/firestore";
import { useEffect } from "react";
import { fetchSong } from "./config/api/api";

function App() {
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
