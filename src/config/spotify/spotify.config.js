function generateRandomString(length) {
   let text = "";
   let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
}

function base64encode(string) {
   return btoa(string)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
}

async function generateCodeChallenge(codeVerifier) {
   const encoder = new TextEncoder();
   const data = encoder.encode(codeVerifier);
   const digest = await crypto.subtle.digest("SHA-256", data);
   const base64encoded = base64encode(
      String.fromCharCode.apply(null, new Uint8Array(digest))
   );
   return base64encoded;
}

export function requestUserAuthorization() {
   const clientId = "9727e0e9618f481caf483f5c4cfda987";
   const currentHref = window.location.href;
   sessionStorage.setItem("redirect_url", currentHref);
   const redirectUri = currentHref;
   setTimeout(async() => {
      console.log("hej");
   }, 10000)
   let codeVerifier = generateRandomString(128);

   generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope =
         "user-read-private user-read-email user-top-read streaming user-read-playback-state user-modify-playback-state user-library-read user-library-modify";

      sessionStorage.setItem("code_verifier", codeVerifier);

      let args = new URLSearchParams({
         response_type: "code",
         client_id: clientId,
         scope: scope,
         redirect_uri: redirectUri,
         state: state,
         code_challenge_method: "S256",
         code_challenge: codeChallenge,
      });

      window.location = "https://accounts.spotify.com/authorize?" + args;
   });
}

export async function requestSpotifyAccessToken(code, refresh = false) {
   const clientId = "9727e0e9618f481caf483f5c4cfda987";
   const redirectUri = sessionStorage.getItem("redirect_url");

   let codeVerifier = sessionStorage.getItem("code_verifier");

   let body;
   if (!refresh) {
      body = new URLSearchParams({
         grant_type: "authorization_code",
         code: code,
         redirect_uri: redirectUri,
         client_id: clientId,
         code_verifier: codeVerifier,
      });
   } else {
      body = new URLSearchParams({
         grant_type: "refresh_token",
         refresh_token: code,
         client_id: clientId,
      });
   }

   await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
   })
      .then((response) => {
         if (!response.ok) {
            throw new Error("HTTP status " + response.status);
         }
         return response.json();
      })
      .then(async (data) => {
         const currentTime = new Date();
         const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);
         localStorage.setItem("token_expires", Date.parse(oneHourLater));
         sessionStorage.setItem("access_token", data.access_token);
         sessionStorage.setItem("refresh_token", data.refresh_token);
      })
      .catch((error) => {
         console.error("Error:", error);
      });
}

export async function getProfile() {
   let accessToken = sessionStorage.getItem("access_token");

   const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
         Authorization: "Bearer " + accessToken,
      },
   });

   await response.json();
}

export async function getTopTracks(player) {
   let accessToken = sessionStorage.getItem("access_token");

   const responseTracks = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=30",
      {
         headers: {
            Authorization: "Bearer " + accessToken,
         },
      }
   );

   const trackData = await responseTracks.json();

   const fetchString = trackData.items.reduce((base, track) => {
      return base + track.id + ",";
   }, "");

   const responseAudioFeatures = await fetch(
      "https://api.spotify.com/v1/audio-features?ids=" + fetchString,
      {
         headers: {
            Authorization: "Bearer " + accessToken,
         },
      }
   );

   const aduioFeaturesData = await responseAudioFeatures.json();

   const filteredArray = aduioFeaturesData.audio_features.filter(
      (track) => track.instrumentalness < 0.6
   );

   const filteredTracks = trackData.items.filter((track) => {
      return filteredArray.some((filterTrack) => {
         return filterTrack.id === track.id;
      });
   });

   const finalArray = filteredTracks.map((item) => {
      const newItem = {
         ...item,
         whosSpotify: player.id,
      };
      return newItem;
   });

   return finalArray;
}

export async function transferPlayback(token, device_id) {
   const url = "https://api.spotify.com/v1/me/player";

   const requestOptions = {
      method: "PUT",
      headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         device_ids: [device_id],
         play: true,
      }),
   };

   try {
      const response = await fetchWithRetry(url, requestOptions);
      return response;
   } catch (error) {
      console.error("Error:", error);
      return null;
   }
}

export async function startPlayback(token, body = "") {
   const url = "https://api.spotify.com/v1/me/player/play";
   const requestOptions = {
      method: "PUT",
      headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      },
      body,
   };
   try {
      const response = await fetchWithRetry(url, requestOptions);
      return response;
   } catch (error) {
      console.error("Error:", error);
      return null;
   }
}

// export async function skipToNext(token, body = "") {
//    const url = "https://api.spotify.com/v1/me/player/play";
//    const requestOptions = {
//       method: "PUT",
//       headers: {
//          Authorization: `Bearer ${token}`,
//          "Content-Type": "application/json",
//       },
//       body,
//    };
//    try {
//       const response = await fetchWithRetry(url, requestOptions);
//       return response;
//    } catch (error) {
//       console.error("Error:", error);
//       return null;
//    }
// }

// export async function skipToNext(token) {
//    const url = "https://api.spotify.com/v1/me/player/next";
//    const requestOptions = {
//       method: "POST",
//       headers: {
//          Authorization: "Bearer " + `${token}`,
//       },
//    };

//    try {
//       const response = await fetchWithRetry(url, requestOptions);
//       if (response.ok) {
//          const responseData = await response.json();
//          return responseData;
//       } else {
//          throw new Error("Request failed.");
//       }
//    } catch (error) {
//       return null;
//    }
// }

// export async function setVolume(token, volume) {
//    const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
//    const requestOptions = {
//       method: "PUT",
//       headers: {
//          Authorization: `Bearer ${token}`,
//       },
//    };
//    try {
//       const response = await fetchWithRetry(url, requestOptions);
//       if (response.ok) {
//          const responseData = await response.json();
//          return responseData;
//       } else {
//          throw new Error("Request failed.");
//       }
//    } catch (error) {
//       return null;
//    }
// }

export async function editFavorite(token, id, method = "DELETE") {
   const url = "https://api.spotify.com/v1/me/tracks";
   const requestOptions = {
      method: method,
      headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         ids: [id],
      }),
   };
   try {
      const response = await fetchWithRetry(url, requestOptions);
      if (response.ok) {
         const responseData = await response.json();
         return responseData;
      } else {
         throw new Error("Request failed.");
      }
   } catch (error) {
      return null;
   }
}

export async function trackInFavorite(token, id) {
   const url = "https://api.spotify.com/v1/me/tracks/contains?ids=" + id;
   const requestOptions = {
      method: "GET",
      headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      },
   };
   try {
      const response = await fetchWithRetry(url, requestOptions);
      if (response.ok) {
         const responseData = await response.json();
         return responseData;
      } else {
         throw new Error("Request failed.");
      }
   } catch (error) {
      return null;
   }
}


async function fetchWithRetry(
   url,
   requestOptions,
   maxRetries = 10,
   retryDelay = 1000
) {
   let retries = 0;
   while (retries < maxRetries) {
      try {
         const response = await fetch(url, requestOptions);
         if (response.ok) {
            return response;
         } else {
            throw new Error("Request failed.");
         }
      } catch (error) {
         console.error("Error:", error);
         retries++;
         if (retries < maxRetries) {
            console.log(`Retrying request in ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
         } else {
            throw new Error("Maximum retry attempts reached.");
         }
      }
   }
}


export async function spotifyApi(operation) {
   const maxRetries = 10;
   const intervalMs = 300;
 
   let retries = 0;
   
   while (retries < maxRetries) {
     try {
       const result = await operation;
       console.log("Nice");
       return result; // Operation succeeded, return the result
     } catch (error) {
       if (error) {
         retries++;
         console.log(`Retry attempt ${retries} failed with error: ${error.message}`);
         await new Promise(resolve => setTimeout(resolve, intervalMs));
       } else {
         throw error; // Re-throw if it's not a Spotify-specific error
       }
     }
   }
 
   throw new Error(`Operation failed after ${maxRetries} retries`);
 }