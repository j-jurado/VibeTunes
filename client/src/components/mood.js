
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moods from '../util/moods';
import '../App.css';

let userID = "";
let userEmail = "";
let playlistID = "";
let currentMood = "";
let playlistLink = "";
let sharedPlaylistID = "";
let currentPlaylist = [];

function Mood() {
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [moodInput, setMoodInput] = useState('');
  const [invalidMood, setInvalidMood] = useState(false);
  const [recentMoods, setRecentMoods] = useState([]);
  const [validPlaylist, setValidPlaylist] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const musicNoteStyles = Array.from({ length: 8 }).map((_, index) => ({
    top: -100,
    left: `${12 * index}%`,
    position: "absolute",
    width: "50px",
    height: "50px",
    backgroundImage: 'url("https://cdn.discordapp.com/attachments/1080566050132865074/1166898705685807144/music-note-icon-34259.png?ex=654c2a1b&is=6539b51b&hm=b46a007212c9e2df82f9d2dc6564bc01232038e06dba2b3b43b8a065a5082b53&")',
    backgroundSize: "cover",
    animation: `move 8s linear infinite`,
    animationDelay: `${index * 2}s`,
  }));

  useEffect(() => {
    setToken(window.localStorage.getItem("token"));
    if (!token) {
      logout();
    }
  })

  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  }

  // ===* Friend Functions *===

  const handleNameChange = (e) => {
    setFriendName(e.target.value);
  };

  const handleAddFriend = () => {
    if (friendName.trim() !== '') {
      setFriends([friendName, ...friends]);
      setFriendName('');
    }
  };

  const handleFriendClick = (friend) => {
    if (friend === selectedFriend) {
      setSelectedFriend('');
    } else {
      setSelectedFriend(friend);
    }
  };

  // Creates permanent playlist to send to friend
  async function handleShareClick() {
    if (selectedFriend !== '' && playlistID !== '') {
      await buildSharedPlaylist();
      const shareLink = "https://open.spotify.com/playlist/" + sharedPlaylistID;
      alert("Shared your " + moodInput.toUpperCase() +
        " playlist with " + selectedFriend +
        "\nLink: " + shareLink);
    }
  }

  // ===* Build Functions *===

  // Validates and parses selcted mood
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
    setRecentMoods([moodInput, ...recentMoods]);
    currentMood = moodInput;
    return mood;
  }

  // Retrieves current user information
  async function setUserInfo() {
    const USER_ENDPOINT = "https://api.spotify.com/v1/me";
    await fetch(USER_ENDPOINT, {
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
        userID = data.id;
        userEmail = data.email;
      })
  }

  // Retrieves artists from user profile for recommendation seed
  async function getArtists() {
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

  // Generates list of recommended tracks
  async function generateTracks(mood) {
    currentPlaylist = [];
    const artists = await getArtists();

    // Build recommendation API endpoint
    const RECOMMEND_ENDPOINT = "https://api.spotify.com/v1/recommendations?limit=10"
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

  // Builds playlist on user's profile
  async function buildPlaylist() {
    await setUserInfo();

    const mood = parseMood();
    if (!mood) return;

    const playlistName = "VibeTunes Mood Playlist";

    // Creates a VibeTunes playlist if it doesn't already exist
    if (playlistID.length == 0) {
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
        })
    }

    // Clear tracks from current playlist (helpful for regenerating playlist)
    const EDIT_PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks"
    if (currentPlaylist.length != 0) {
      await fetch(EDIT_PLAYLIST_ENDPOINT, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          tracks: currentPlaylist.map(uri => ({ uri })),
        })
      })
    }

    // Adds recommended tracks to current playlist
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

    playlistLink =
      "https://open.spotify.com/embed/playlist/" +
      playlistID +
      "?utm_source=generator";

    // Refreshes embedded playlist player
    if (validPlaylist) {
      document.getElementById('Player').src = document.getElementById('Player').src;
    }
    setValidPlaylist(true);
  }

  // Builds permanent shareable playlist
  async function buildSharedPlaylist() {
    const playlistName = "VibeTunes: " + moodInput.toUpperCase();

    // Creates shareable playlist
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
        sharedPlaylistID = data.id;
      })

    // Populate shared playlist based on current playlist
    const EDIT_PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/" + sharedPlaylistID + "/tracks"
    await fetch(EDIT_PLAYLIST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        uris: currentPlaylist
      })
    })
  }

  return (
    <div className="app-container">
      {musicNoteStyles.map((style, index) => (
        <div key={index} style={style} className={`music-note-${index}`} />
      ))}
      <div className="mood">
        <h1>VibeTunes</h1>
        <button className="mood-button" onClick={logout}>Logout</button>
        <div className="container">
          <div className="column">
            <h2>Mood</h2>
            <input
              className="input-responsive"
              type="text"
              value={moodInput}
              placeholder="Enter Mood"
              onChange={(e) => setMoodInput(e.target.value.toLowerCase())}
            />
            <button className="mood-button" onClick={buildPlaylist}>Generate</button>
            {/* Following code block moved here */}
            <div>
              {invalidMood ? <p>Invalid Mood!</p> : null}
            </div>
            <div style={{ width: '100px', height: '100px' }}>
              {validPlaylist
                ? <iframe
                  id="Player"
                  src={playlistLink}
                  width="500px"
                  height="500px"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy">
                </iframe>
                : <div className="PlayerNotLoaded"></div>
              }
            </div>
          </div>
          <div className="column">
            <h2>Recent Moods</h2>
            {recentMoods.slice(0, 4).map((mood, index) => (
              <p key={index}>{mood}</p>
            ))}
          </div>
          <div className="column">
            <h2>Friend List</h2>
            <div className="friends-list">
              {friends.slice(0, 4).map((friend, index) => (
                <p
                  key={index}
                  onClick={() => handleFriendClick(friend)}
                  style={{ color: friend === selectedFriend ? 'red' : 'black' }}>{friend}</p>
              ))}
            </div>
            {/* Following input field placed here */}
            <div>
              <input
                className="input-responsive"
                type="text"
                placeholder="Enter Username"
                value={friendName}
                onChange={handleNameChange}
              />
              <button className="mood-button" onClick={handleAddFriend}>Add</button>
            </div>
            <div>
              <button className="mood-button"
                onClick={handleShareClick}
                disabled={selectedFriend !== '' && playlistID !== '' ? false : true}
              >Share Playlist</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Mood;
