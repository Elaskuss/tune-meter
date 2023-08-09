import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import {
   addToFavorite,
   editFavorite,
   skipToNext,
   startPlayback,
   trackInFavorite,
} from "../../config/spotify/spotify.config";
import {
   ArtistName,
   NameContainer,
   NextSongContainer,
   NextTrackContainer,
   SongInfo,
   SongInfoContainer,
   SongName,
   StyledPlayerContainer,
} from "./WebPlayback.styles";
import NextTrack from "../../svg/NextTrack";
import { useNavigate } from "react-router-dom";
import Heart from "../../svg/Heart";

const track = {
   name: "",
   album: {
      images: [{ url: "" }],
   },
   artists: [{ name: "" }],
};

function WebPlayback(props) {
   const { token } = props;
   const { songs, players, updatePlayer, player, spotifyPlayer, updateSpotifyPlayer } =
      useContext(PlayerContext);
   const { current_track } = spotifyPlayer;
   const [songsInitialized, setSongsInitialized] = useState(false);
   const [showSongSkip, setShowSongSkip] = useState(false);
   const [changeSongVote, setChangeSongVote] = useState(0);
   const [favorite, setFavorite] = useState("none");

   const handleNextSong = () => {
      updatePlayer({ ...player, changeSong: !player.changeSong });
   };

   const handleSongs = async (uris) => {
      const body = JSON.stringify({
         uris: uris,
         offset: {
            position: player.round,
         },
         position_ms: 0,
      });
      await startPlayback(token, body);
      setTimeout(async () => {
         await startPlayback(token, body);
      }, 100);
   };

   useEffect(() => {
      if (songs.length && !songsInitialized) {
         const uris = songs.map((song) => {
            return song.uri
         });
         handleSongs(uris);
         setSongsInitialized(true);
      }
   }, [songs]);

   useEffect(() => {
      const guessed = players.reduce((count, player) => {
         if (player.guessed) {
            return count + 1;
         }
         return count;
      }, 0);

      if (guessed === players.length) {
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
         updatePlayer({
            ...player,
            changeSong: !player.changeSong,
            round: player.round + 1,
         });
      }
   }, [players]);

   useEffect(() => {
      const nextSongHandler = async () => {
         if (!player.guessed && player.round) {
            const uris = songs.map((song) => {
               return song.uri
            });
            const body = JSON.stringify({
               uris: uris,
               offset: {
                  position: player.round,
               },
               position_ms: 0,
            });
            await skipToNext(token, body);
         }
      };
      nextSongHandler();
   }, [player]);

   useEffect(() => {
      const checkIfFavoriteSong = async () => {
         if(current_track.id){
            const isFavorite = await trackInFavorite(token, current_track.id);
            console.log("_______________________________________________________")
            console.log(isFavorite);
            isFavorite[0] ? setFavorite("#1DB954") : setFavorite("none");
         }
      }

      checkIfFavoriteSong();
   }, [current_track]);

 

   const favoriteSong = async () => {
      let method;
      favorite === "#1DB954" ? method = "DELETE" : method = "PUT";
      await editFavorite(token, current_track.id, method);
      favorite === "#1DB954" ? setFavorite("none") : setFavorite("#1DB954");
   }

   if (!current_track.id) {
      return (
         <>
            <div className="container">Loading</div>
         </>
      );
   } else {
      return (
         <StyledPlayerContainer>
            <SongInfoContainer>
               <img src={current_track.album.images[0].url} alt="Album Cover" />
               <NameContainer>
                  <SongInfo>
                     <SongName>{current_track.name}</SongName>
                     <ArtistName>
                        {current_track.artists.reduce((acc, artist) => {
                           if (artist.uri != current_track.artists[0].uri) {
                              return acc + "," + `${artist.name}`;
                           } else {
                              return acc;
                           }
                        }, `${current_track.artists[0].name}`)}
                     </ArtistName>
                  </SongInfo>
                  <Heart color={favorite} onClick={favoriteSong}>Favorite</Heart>
               </NameContainer>
            </SongInfoContainer>
            <NextSongContainer>
               {showSongSkip ? (
                  <NextTrackContainer>
                     <NextTrack onClick={handleNextSong} />
                  </NextTrackContainer>
               ) : (
                  <p>Waiting for players to guess</p>
               )}

               <div>
                  {Math.ceil(players.length * 0.51) - changeSongVote} more votes
                  needed for next round
               </div>
            </NextSongContainer>
         </StyledPlayerContainer>
      );
   }
}

export default WebPlayback;
