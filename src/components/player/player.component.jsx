import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { DisplayName, PlayerContainer, Ready } from "./player.styles";

const Player = ({ displayName, id, status, disable }) => {
    const { updatePlayer, player } = useContext(PlayerContext);

    const notReady = { ...player, status: "Not Ready" };
    const ready = { ...player, status: "Ready" };

    const readyHandler = async () => {
        switch (player.status) {
            case "Ready":
                updatePlayer(notReady);
                break;
            case "Not Ready":
                updatePlayer(ready);
                break;
            default:
                updatePlayer(notReady);
                break;
        }
    };

    return (
        <PlayerContainer key={id}>
            <DisplayName>{displayName}</DisplayName>
            {player.id === id ? (
                <Ready disabled={disable} onClick={readyHandler}>
                    Ready
                </Ready>
            ) : (
                <p>{status}</p>
            )}
        </PlayerContainer>
    );
};

export default Player;
