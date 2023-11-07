import Index from "./pages/index/index";
import { Route, Routes } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import Game from "./pages/game/game";

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
