import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { PlayerContext } from "../../context/player.context";
import {
   editFavorite,
   spotifyApi,
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
import Heart from "../../svg/Heart";

function WebPlayback(props) {
   const { token } = props;
   const { songs, players, updatePlayer, player, spotifyPlayer } =
      useContext(PlayerContext);
   const [songsInitialized, setSongsInitialized] = useState(false);
   const [showSongSkip, setShowSongSkip] = useState(false);
   const [changeSongVote, setChangeSongVote] = useState(0);
   const [favorite, setFavorite] = useState("none");
   const [finishedLoading, setFinishedLoading] = useState(false);
   const [toggleVolume, setToggleVolume] = useState(false);

   const handleNextSong = () => {
      updatePlayer({ ...player, changeSong: !player.changeSong });
   };

   console.log("hej");

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

      let actionTimer = null;
      let songUri = songs[player.round].uri;
      spotifyPlayer.addListener("player_state_changed", (state) => {
         if (state.track_window.current_track.uri === songUri) {
            console.log("New Song");
            if (actionTimer) {
               clearTimeout(actionTimer); // Clear the previous timer
            }
            actionTimer = setTimeout(() => {
               console.log(state);
               songUri = "";
               setFinishedLoading(true);
               setTimeout(() => {
                  spotifyPlayer.resume();
               }, 500);
            }, 500);
         }
      });
   };

   useEffect(() => {
      if (songs[0] && !songsInitialized) {
         const uris = songs.map((song) => {
            return song.uri;
         });
         handleSongs(uris);
         setSongsInitialized(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // eslint-disable-next-line
   }, [players]);

   useEffect(() => {
      const nextSongHandler = async () => {
         if (!player.guessed && player.round) {
            spotifyApi(spotifyPlayer.getVolume()).then(async (response) => {
               if (response) {
                  setToggleVolume(true);
                  await spotifyApi(spotifyPlayer.setVolume(0));
               }
            });
            await spotifyApi(spotifyPlayer.nextTrack());
         }
      };
      nextSongHandler();
      // eslint-disable-next-line
   }, [player]);

   useEffect(() => {
      const fastForward = async () => {
         spotifyApi(spotifyPlayer.seek(12 * 1000)).then(() => {
            spotifyApi(spotifyPlayer.setVolume(0.5));
         });
         setToggleVolume(false);
         setFinishedLoading(false);
      };

      if (finishedLoading) {
         fastForward();
      }
      // eslint-disable-next-line
   }, [finishedLoading]);

   useEffect(() => {
      const checkIfFavoriteSong = async () => {
         if (songs[player.round].id) {
            const isFavorite = await trackInFavorite(
               token,
               songs[player.round].id
            );
            isFavorite[0] ? setFavorite("#1DB954") : setFavorite("none");
         }
      };

      checkIfFavoriteSong();
      // eslint-disable-next-line
   }, [player.round]);

   const favoriteSong = async () => {
      let method;
      favorite === "#1DB954" ? (method = "DELETE") : (method = "PUT");
      await editFavorite(token, songs[player.round].id, method);
      favorite === "#1DB954" ? setFavorite("none") : setFavorite("#1DB954");
   };

   if (!songs[0]) {
      return (
         <>
            <div className="container">Loading</div>
         </>
      );
   } else {
      return (
         <StyledPlayerContainer>
            <SongInfoContainer>
               <img
                  src={songs[player.round].album.images[1].url}
                  alt="Album Cover"
               />
               <NameContainer>
                  <SongInfo>
                     <SongName>{songs[player.round].name}</SongName>
                     <ArtistName>
                        {songs[player.round].artists.reduce((acc, artist) => {
                           if (
                              artist.uri !== songs[player.round].artists[0].uri
                           ) {
                              return acc + ` ${artist.name}`;
                           } else {
                              return acc;
                           }
                        }, `${songs[player.round].artists[0].name}`)}
                     </ArtistName>
                  </SongInfo>
                  <Heart color={favorite} onClick={favoriteSong}>
                     Favorite
                  </Heart>
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
