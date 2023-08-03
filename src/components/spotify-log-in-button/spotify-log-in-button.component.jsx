import { LogInButton } from "./spotify-log-in-button.styles"

const SpotifyLogInButton = ({promt, handleEvent}) => {
   return (
      <LogInButton onClick={handleEvent}>{promt}</LogInButton>
   )
}

export default SpotifyLogInButton;