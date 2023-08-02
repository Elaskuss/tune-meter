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

   generateCodeChallenge(codeVerifier).then(codeChallenge => {
      let state = generateRandomString(16);
      let scope = "user-read-private user-read-email";

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

export async function requestSpotifyAccessToken(code) {
   const clientId = "9727e0e9618f481caf483f5c4cfda987";
   const redirectUri = "http://localhost:3000/";

   let codeVerifier = sessionStorage.getItem("code_verifier");

   let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
   });

   const response = await fetch("https://accounts.spotify.com/api/token", {
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
      .then((data) => {
         sessionStorage.setItem("access_token", data.access_token);
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

   const data = await response.json();
   console.log(data);
}
