import React, { useContext, useState } from "react";
import AppContext from "../components/AppContext";
import { allowedPage } from "../pageNavigator";
import { socket } from "../socket";

export default function Login() {
  const { setPage } = useContext(AppContext);
  const appState = useContext(AppContext);
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      // If login failed
      alert("Incorrect Username and/or Password");
      setUser((prevState) => ({ ...prevState, password: "" }));
      setLoading(false);
    } else {
      // If login succeeded
      socket.connect(); // Attempt to connect to the socket
    }
  };

  return (
    <div
      className="page"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Login</h1>
      <input
        onChange={handleChange}
        value={user.username}
        autoFocus
        autoComplete="off"
        name="username"
        placeholder="Username..."
      ></input>
      <input
        onChange={handleChange}
        value={user.password}
        name="password"
        type="password"
        placeholder="Password..."
      ></input>
      <button onClick={handleSubmit}>
        {!loading && "Login"}
        {loading && (
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        )}
      </button>

      <div style={{ display: "block" }}>
        <p
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => {
            setPage(allowedPage(appState, "register"));
          }}
        >
          Register
        </p>
      </div>
    </div>
  );
}
