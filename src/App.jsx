import Index from "./pages/index/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import Lobby from "./pages/lobby/lobby";
import Game from "./pages/game/game";
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "./context/player.context";

function App() {
  const { player } = useContext(PlayerContext);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setReload(localStorage.getItem("reload"));
    if (reload) {
      navigate("/");
      localStorage.setItem("reload", false);
    }
    // eslint-disable-next-line
  }, [reload]);

  useEffect(() => {
    if (!player.gameKey) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [player]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = true; // Display a confirmation dialog
    };

    const handleUnload = () => {
      localStorage.setItem("reload", true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

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
