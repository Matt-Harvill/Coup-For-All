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
      className="page registerPage"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <h1
      //  style={{ color: "#14FFEC" }}
      >
        Register
      </h1>
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
        {!loading && "Register"}
        {loading && (
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        )}
      </button>

      <div style={{ display: "block" }}>
        <p style={{ display: "inline" }}>
          Already have an account?{" "}
          <p
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              display: "inline",
              color: "white",
            }}
            onClick={() => {
              setNewPage("login");
            }}
          >
            Login
          </p>
        </p>
      </div>
    </div>
  );
}
