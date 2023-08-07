import { spotifyApi } from "react-spotify-web-playback";
import {
   ArtistName,
   NameContainer,
   NextSongContainer,
   NextTrackContainer,
   SongName,
} from "./custom-player.styles";
import NextTrack from "../../svg/NextTrack";
import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import { useState } from "react";
import { useEffect } from "react";
const customPlayerStyles = {
   display: "flex",
   alignItems: "center",
   background: "#191414",
   color: "#fff",
   padding: "10px",
};

const nextButtonStyles = {
   marginRight: "10px",
   cursor: "pointer",
};

const favoriteButtonStyles = {
   marginLeft: "auto",
   cursor: "pointer",
};

const CustomPlayer = ({ token, song, state }) => {
   const { player, players, updatePlayer } = useContext(PlayerContext);
   const [showSongSkip, setShowSongSkip] = useState(false);
   const [changeSongVote, setChangeSongVote] = useState(0);
   const handleNextSong = () => {
      updatePlayer({ ...player, changeSong: !player.changeSong });
   };

   useEffect(() => {
      const guessed = players.reduce((count, player) => {
         if (player.guessed) {
            return count + 1;
         }
         return count;
      }, 0);

      if(guessed === players.length){
         setShowSongSkip(true);
      }

      const changeSongVote = players.reduce((acc, player) => {
         if (player.changeSong) {
            return acc + 1;
         }
         return acc;
      }, 0);

      setChangeSongVote(changeSongVote);

      if (changeSongVote / players.length > 0.5) {
         updatePlayer({ ...player, changeSong: !player.changeSong, round: player.round + 1});
      }
   }, [players])

   const handleFavorite = async () => {
      const trackStatus = await spotifyApi.checkTracksStatus(
         token,
         state.track.id
      );
      console.log(trackStatus);
      if (!trackStatus[0]) {
         spotifyApi.saveTracks(token, state.track.id);
      } else {
         spotifyApi.removeTracks(token, state.track.id);
      }
   };

   return (
      <div style={customPlayerStyles}>
         <div>
            <img src={song.album.images[1].url} alt="Album Cover" />
            <NameContainer>
               <div>
                  <SongName>{song.name}</SongName>
                  <ArtistName>
                     {song.album.artists.reduce((acc, artist) => {
                        if (artist.uri != song.artists[0].uri) {
                           return acc + "," + `${artist.name}`;
                        } else {
                           return acc;
                        }
                     }, `${song.album.artists[0].name}`)}
                  </ArtistName>
               </div>
               <div style={favoriteButtonStyles} onClick={handleFavorite}>
                  Favorite
               </div>
            </NameContainer>
         </div>
         <NextSongContainer>
            {showSongSkip ?  <NextTrackContainer>
               <NextTrack onClick={handleNextSong}/>
            </NextTrackContainer> : <p>Waiting for players to guess</p>}
           
            <div style={nextButtonStyles}>
               {Math.ceil(players.length * 0.51) - changeSongVote} more votes needed for next round
            </div>
         </NextSongContainer>
      </div>
   );
};

export default CustomPlayer;
