import React, { useContext, useState } from "react";
import AppContext from "../components/AppContext";

export default function Register() {
  const { setPage } = useContext(AppContext);
  const [user, setUser] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    console.log("character typed", e.target);

    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const response = await fetch("/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      alert("Error Registering User");
      setUser((prevState) => ({ ...prevState, password: "" }));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <textarea
        onChange={handleChange}
        value={user.username}
        autoFocus
        autoComplete="off"
        name="username"
        placeholder="Username..."
      ></textarea>
      <textarea
        onChange={handleChange}
        value={user.password}
        name="password"
        placeholder="Password..."
      ></textarea>
      <button onClick={handleSubmit}>Register</button>

      <div style={{ display: "block" }}>
        <p
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => {
            setPage("login");
          }}
        >
          Login
        </p>
      </div>
    </div>
  );
}
