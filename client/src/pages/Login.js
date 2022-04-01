import React, { useContext, useState } from "react";
import AppContext from "../components/AppContext";

export default function Login() {
  const { setPage } = useContext(AppContext);
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log("character typed", e.target);

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
      alert("Incorrect Username and/or Password");
      setUser((prevState) => ({ ...prevState, password: "" }));
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
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
            setPage("register");
          }}
        >
          Register
        </p>
      </div>
    </div>
  );
}
