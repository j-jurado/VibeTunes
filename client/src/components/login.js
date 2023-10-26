import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {

    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.location.hash = "";
            window.localStorage.setItem("token", token);
            setToken(token);
        } else if (token) { navigate("/mood") }
    }, [])

    const spotifyAuthLogin = () => {
        const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
        const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
        const PERMISSIONS = [
            'user-follow-read',
            'user-read-private',
            'user-read-email',
            'playlist-modify-public',
            'playlist-modify-private'
        ]

        const AUTH_LINK =
            AUTH_ENDPOINT + "?client_id=" +
            CLIENT_ID + "&redirect_uri=" +
            REDIRECT_URI + "&response_type=token" +
            "&scope=" + PERMISSIONS.join('%20');

        window.location = AUTH_LINK;
    }

    return (
        <div className="home">
            <div className="home app-container">
                <div class="site-logo"><img src="https://cdn.discordapp.com/attachments/1080566050132865074/1163502858201747577/vibetunes_prev_ui.png?ex=653fcf7a&is=652d5a7a&hm=796cac0e96f6cb8ca866d9fb259a8bed5c67c82042191e5e08d1e65ae26e1036&" width="100%" alt="mainlogo"></img></div>
                <button onClick={spotifyAuthLogin}>
                    Login With Spotify
                    <img src="https://cdn.discordapp.com/attachments/1080566050132865074/1163505951542890658/spotify_logo_prev_ui.png?ex=653fd25b&is=652d5d5b&hm=b034d7d543c35be5c7770a0988b51bfeee3c7a0d1ff40e53f4ca7f7d768a9b77&" width="35" height="35"></img>
                </button>
            </div>
        </div>

    );
}

export default Login;
