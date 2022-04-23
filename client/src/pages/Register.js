import React, { useContext, useState } from "react";
import AppContext from "../components/AppContext";
import { socket } from "../socket";

export default function Register() {
  const { setNewPage } = useContext(AppContext);
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const response = await fetch("/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      // If register failed
      alert("Invalid Username and/or Password");
      setUser((prevState) => ({ ...prevState, password: "" }));
      setLoading(false);
    } else {
      // If register succeeded
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
      <h1>Register</h1>
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
        {!loading && "Register"}
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
            setNewPage("login");
          }}
        >
          Login
        </p>
      </div>
    </div>
  );
}
