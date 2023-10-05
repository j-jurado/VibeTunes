import Login from './login.js';

function Home() {
    const handleClick = () => {
        <Login />
    };

    return (
        <div className="home">
        <h1>VibeTunes</h1>
        <p>Home Page</p>
        <div>
            <input
            type="text"
            placeholder="Username"
            />
        </div>
        <div>
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
