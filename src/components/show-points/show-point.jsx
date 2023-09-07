import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { PointsContainer, PointsInfo, Name, Point } from "./show-points.styles";

const ShowPoints = () => {
    const { players, player } = useContext(PlayerContext);

    players.sort((a, b) => b.points - a.points);
    let count = 0;
    return (
        <PointsContainer>
            <h2>End of round {player.round}</h2>
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
