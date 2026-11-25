const SPOTIFY_CLIENT_ID = "038db72384f14c3d926bde4b8fd33d8c";

const SPOTIFY_REDIRECT_URI =
  "https://jasseliot-prog.github.io/Casa-Lumi-Prueba-4/spotify-callback.html";

async function conectarSpotify() {
  const verifier = Array.from(
    crypto.getRandomValues(new Uint8Array(32)),
    b => b.toString(16).padStart(2, "0")
  ).join("");

  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );

  const challenge = btoa(
    String.fromCharCode(...new Uint8Array(hash))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const state = crypto.randomUUID();

  sessionStorage.setItem("spotify_verifier", verifier);
  sessionStorage.setItem("spotify_state", state);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: challenge,
    state: state,
    scope: "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private"
  });

  window.location.href =
    "https://accounts.spotify.com/authorize?" +
    params.toString();
}

window.conectarSpotify = conectarSpotify;
