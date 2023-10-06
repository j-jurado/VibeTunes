
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Mood() {

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if(!token) {
        logout();
    }
  })

  const navigate = useNavigate();

  const logout = () => {
      window.localStorage.removeItem("token");
      navigate("/");
  }

  return (
    <div className="mood">
      <h1>VibeTunes</h1>
      <p>Mood Page</p>
      <button onClick={logout}>Logout</button>
    </div>
  );

}

export default Mood;
  