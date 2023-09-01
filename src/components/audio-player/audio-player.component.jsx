function AudioPlayer({ audioUrl}) {
   return (
      <div>
         <audio controls autoPlay loop>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
         </audio>
      </div>
   );
}

export default AudioPlayer;

