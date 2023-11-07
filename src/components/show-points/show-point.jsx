import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { PointsContainer, PointsInfo, Name, Point, Round } from "./show-points.styles";

const ShowPoints = () => {
    const { players, player, lobby } = useContext(PlayerContext);

    players.sort((a, b) => b.points - a.points);
    let count = 0;
    return (
        <PointsContainer>
            <Round>End of round {lobby.round}</Round>
            {players.map((player) => {
                count += 1;
                return (
                    <PointsInfo key={player.id}>
                        <Name>
                            {count + ". \u00A0\u00A0" + player.displayName}
                        </Name>
                        <Point>{player.points}</Point>
                    </PointsInfo>
                );
            })}
        </PointsContainer>
    );
};

export default ShowPoints;
