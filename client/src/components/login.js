import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {

    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if(!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.location.hash = "";
            window.localStorage.setItem("token", token);
            setToken(token);
        } else if(token) { navigate("/mood") }
    }, [])

    const spotifyAuthLogin = () => {
        const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
        const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

        const AUTH_LINK = 
            AUTH_ENDPOINT + "?client_id=" + 
            CLIENT_ID + "&redirect_uri=" + 
            REDIRECT_URI + "&response_type=token";

        window.location = AUTH_LINK;
    }

    return (
        <div className="home">
            <h1>VibeTunes</h1>
            <p>Home Page</p>
            <button onClick={spotifyAuthLogin}>
                Login With Spotify
            </button>
        </div>
    );
}

export default Login;
