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
   const redirectUri = "http://localhost:3000/";

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

export async function requestSpotifyAccessToken(
   code,
   refresh = false
) {
   const clientId = "9727e0e9618f481caf483f5c4cfda987";
   const redirectUri = "http://localhost:3000/";

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
      "https://api.spotify.com/v1/me/top/tracks?limit=100",
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


export async function getPlayerState(accessToken, market = "", additionalTypes = "") {
   const apiUrl = 'https://api.spotify.com/v1/me/player';
   let headers = {
     'Content-Type': 'application/json',
   };
 
   if (accessToken) {
     headers['Authorization'] = `Bearer ${accessToken}`;
   }
 
   // Prepare query parameters for the request
   let queryParams = '';
   if (market) {
     queryParams += `market=${market}`;
   }
 
   if (additionalTypes) {
     queryParams += `${queryParams ? '&' : ''}additional_types=${additionalTypes}`;
   }
 
   if (queryParams) {
     apiUrl += `?${queryParams}`;
   }
 
   try {
     const response = await fetch(apiUrl, {
       method: 'GET',
       headers: headers,
     });
 
     if (!response.ok) {
       throw new Error('Failed to get player state.');
     }
 
     const data = await response.json();
     return data;
   } catch (error) {
     console.error('Error while getting player state:', error.message);
     return null;
   }
 }
 