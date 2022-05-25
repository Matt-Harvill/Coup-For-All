import React, { useContext, useState } from "react";
import AppContext from "../components/AppContext";
import { socket } from "../socket";

export default function Login() {
  const { setNewPage } = useContext(AppContext);
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
        gap: 10,
      }}
    >
      <h1>Login</h1>
      <div>
        <input
          onChange={handleChange}
          value={user.username}
          autoFocus
          autoComplete="off"
          name="username"
          placeholder="Username..."
          style={{ display: "block" }}
        ></input>
        <input
          onChange={handleChange}
          value={user.password}
          name="password"
          type="password"
          placeholder="Password..."
          style={{ display: "block" }}
        ></input>
      </div>

      <button onClick={handleSubmit}>
        {!loading && "Login"}
        {loading && (
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        )}
      </button>

      <div style={{ display: "block" }}>
        <p style={{ display: "inline" }}>
          Don't have an account?{" "}
          <p
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              display: "inline",
              color: "#14FFEC",
            }}
            onClick={() => {
              setNewPage("register");
            }}
          >
            Register
          </p>
        </p>
      </div>
    </div>
  );
}
