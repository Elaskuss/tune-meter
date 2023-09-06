import { StyledAudio } from "./audio-player.styles";

function AudioPlayer({ audioUrl}) {
   return (
      <StyledAudio>
         <audio controls autoPlay loop>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
         </audio>
      </StyledAudio>
   );
}

export default AudioPlayer;

