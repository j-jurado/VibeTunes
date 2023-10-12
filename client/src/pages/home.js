import Login from './login.js';

function Home() {
    const handleClick = () => {
        <Login />
    };

    return (
        <div className="home">
        <div className="title">
            <h1>VibeTunes</h1>
        </div>
        <p>Home Page</p>
        <div className="user">
            <input
            type="text"
            placeholder="Username"
            />
        </div>
        <div className="pass">
            <input
            type="text"
            placeholder="Password"
            />
        </div>
        <button onClick={handleClick}>Login With Spotify</button>
        </div>
    );
}

export default Home;
