import { GameContainer, Title } from "./game.styled";

const Game = () => {

   return (
      <GameContainer>
         <Title>Whos that Spotify?</Title>
                  {/* <GuessPlayerContainer>
                     {players.map((player) => (
                        <GuessPlayer
                           song={songs[player.round]}
                           key={player.id}
                           playerInfo={player}
                        />
                     ))}
                  </GuessPlayerContainer> */}
      </GameContainer>
   );
};
export default Game;
