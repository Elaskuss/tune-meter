function AudioPlayer({ audioUrl }) {

    return (
        <div>
            <audio id={"autoPlay"} autoPlay controls hidden loop>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default AudioPlayer;
