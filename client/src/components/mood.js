
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moods from '../util/moods';

let userID = "";
let userEmail = "";
let playlistID = "";
let currentMood = "";
let currentPlaylist = [];

function Mood() {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [moodInput, setMoodInput] = useState('');
  const [invalidMood, setInvalidMood] = useState(false);
  // const [playlistID, setPlaylistID] = useState('');


  useEffect(() => {
    // const token = window.localStorage.getItem("token");
    setToken(window.localStorage.getItem("token"));
    if(!token) {
        logout();
    }
  })

  const navigate = useNavigate();
  const logout = () => {
      window.localStorage.removeItem("token");
      navigate("/");
  }

  // Validates selected mood input
  const parseMood = () => {
    if (!moodInput) {
      setInvalidMood(true);
      return null;
    }

    const mood = moods.get(moodInput);
    if (!mood) {
      setInvalidMood(true);
      return null;
    }

    setInvalidMood(false);
    currentMood = moodInput;
    return mood;
  }

  // Retrieves current user information
  async function setUserInfo() {
    const USER_ENDPOINT = "https://api.spotify.com/v1/me";
    await fetch(USER_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then((response) => {
      if (!response.ok) throw Error(response);
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      // console.log(data.id);
      // console.log(data.email);
      // await setUserID(data.id);
      // await setUserEmail(data.email);
      userID = data.id;
      userEmail = data.email;
    })
  }

  // Retrieves artists from user profile for recommendation seed
  async function getArtists() {
    // const token = window.localStorage.getItem("token");
    let artists = "";
    let artistCount = 0;

    // API artists fetch
    const ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/following?type=artist"
    await fetch(ARTISTS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {
      if (!response.ok) throw Error(response);
      return response.json();
    })
    .then((data) => {
      data.artists.items.forEach(artist => {
        if (artists.length == 0) {
          artists += artist.id;
          artistCount++;
        } else if (artistCount == 5) {
          return artists;
        } else {
          artists += "," + artist.id;
          artistCount++;
        }
        console.log("Adding artist: " + artist.name);
      })
    })

    // Default artists (Taylor Swift, Drake, Bad Bunny) if
    // user is not following any artists
    if (artists.length == 0) {
      artists = 
        "06HL4z0CvFAxyc27GXpf02," +
        "3TVXtAsR1Inumwj472S9r4," +
        "4q3ewBCX7sLwd24euuV69X";
    }

    return artists;
  }

  // Generates list of tracks
  async function generateTracks(mood) {
    // const token = window.localStorage.getItem("token");

    // const mood = parseMood();
    // if (!mood) return;
    // console.log("Generating songs for mood: " + mood);
    currentPlaylist = [];
    const artists = await getArtists();

    // Build recommendation API endpoint
    const RECOMMEND_ENDPOINT =  "https://api.spotify.com/v1/recommendations?limit=10"
    const RECOMMEND_LINK = RECOMMEND_ENDPOINT +
      "&seed_artists=" + artists +
      "&target_energy=" + mood.energy +
      "&target_valence=" + mood.valence +
      "&target_liveliness=" + mood.liveliness +
      "&target_loudness=" + mood.loudness +
      "&target_temp" + mood.tempo +
      "&target_danceability=" + mood.danceability;
     
    let songIDs = "";
    // API recommended tracks fetch
    await fetch(RECOMMEND_LINK, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {
      if (!response.ok) throw Error(response);
      return response.json();
    })
    .then((data) => {
      data.tracks.forEach(song => {
        // retStr = song.name + ": ";
        // song.artists.forEach(artist => {
        //   retStr += artist.name + " ";
        // })
        currentPlaylist.push("spotify:track:" + song.id);
        if (songIDs.length == 0) {
          songIDs = song.id;
        } else {
          songIDs += "," + song.id;
        }
      })
    })
    return songIDs;
  }

  async function buildPlaylist() {
    await setUserInfo();

    const mood = parseMood();
    if(!mood) return;

    const playlistName = "VibeTunes: " + currentMood.toUpperCase();
    console.log("current playlistID: " + playlistID);

    // Creates a VibeTunes playlist if it doesn't already exist
    if(playlistID.length == 0) {
      const CREATE_PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/users/" + userID + "/playlists"
      await fetch(CREATE_PLAYLIST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          "name": playlistName,
          "description": "Playlist generated by VibeTunes",
          "public": true
        })
      })
      .then((response) => {
        if (!response.ok) throw Error(response);
        return response.json();
      })
      .then((data) => {
        playlistID = data.id;
        // setPlaylistID(data.id);
        console.log(playlistID);
      })

    } else {
      // Update playlist name to match new mood
      const EDIT_DETAILS_ENDPOINT = "https://api.spotify.com/v1/playlists/" + playlistID;
      await fetch(EDIT_DETAILS_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          "name": playlistName,
          "description": "Playlist generated by VibeTunes",
          "public": true
        })
      });
    }
      
    const EDIT_PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks"
    if (currentPlaylist.length != 0) {
      await fetch(EDIT_PLAYLIST_ENDPOINT, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          tracks: currentPlaylist.map(uri => ({uri})),
        })
      })
    }

    console.log("Generating for mood: " + moodInput);
    await generateTracks(mood);
    await fetch(EDIT_PLAYLIST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        uris: currentPlaylist
      })
    })

    // if (currentPlaylist.length != 0) {
    //   await fetch(EDIT_PLAYLIST_ENDPOINT, {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': 'Bearer ' + token
    //     },
    //     body: JSON.stringify({
    //       tracks: currentPlaylist.map(uri => ({uri})),
    //     })
    //   })
    // } else {
    //   await generateTracks(mood);
    //   await fetch(EDIT_PLAYLIST_ENDPOINT, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Bearer ' + token
    //     },
    //     body: JSON.stringify({
    //       tracks: currentPlaylist.map(uri => ({uri})),
    //     })
    //   })
    // }

    // const songIDs = await generateTracks(mood);

      










    // console.log(songIDs);
    console.log(userID);
    console.log(userEmail);
  }
  
  return (
    <div className="mood">
      <h1>VibeTunes</h1>
      <p>Mood Page</p>
      <button onClick={logout}>Logout</button>
      <div>
        <input
          type="text"
          value={moodInput}
          onChange={(e) => setMoodInput(e.target.value.toLowerCase())}
        />
        <div>
          {invalidMood ? <p>Invalid Mood!</p> : null}
        </div>
        <button onClick={buildPlaylist}>Generate</button>
      </div>
    </div>
  );

}

export default Mood;
  