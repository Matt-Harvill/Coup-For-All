import { useState, useEffect } from "react";
import CoupCreateGame from "../components/CoupCreateGame";
import { socket } from "../socket";
import unlock from "../images/unlock.png";
import lock from "../images/lock.png";
import "../styles/Coup.css";

export default function Coup() {
  const [newChat, setNewChat] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [chats, setChats] = useState([]);

  const [privacy, setPrivacy] = useState(unlock);
  const [numPlayers, setNumPlayers] = useState("2");

  useEffect(() => {
    socket.on("coup online", (users) => {
      setOnlineUsers(users);
    });

    socket.on("coup games", (games) => {
      setGames(games);
    });

    socket.on("coup chat", (user, message) => {
      setChats((oldChats) => [...oldChats, [user, message]]);
    });

    socket.emit("coup addPlayer");
    socket.emit("coup games");

    return () => {
      socket.off("coup online"); // remove coup online listener
      socket.off("coup chat"); // remove chat listener
      socket.off("coup games"); // remove games listener
      socket.emit("coup removePlayer");
    };
  }, []);

  const sendChat = () => {
    socket.emit("coup chat", newChat);
    setNewChat("");
  };

  const displayChats = (chat) => {
    return (
      <p style={{ wordBreak: "break-word" }}>
        <strong>{`${chat[0]}: `}</strong>
        {chat[1]}
      </p>
    );
  };

  const displayPlayers = (player) => {
    return (
      <p
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <strong>{player}</strong>
      </p>
    );
  };

  const displayGames = (game) => {
    return (
      <p style={{ wordBreak: "break-word" }}>
        <strong>{`${game.founder}'s game, privacy: ${game.privacy}`}</strong>
      </p>
    );
  };

  const createGame = () => {
    let privacyString;
    if (privacy === lock) {
      privacyString = "private";
    } else if (privacy === unlock) {
      privacyString = "public";
    } else {
      alert("error creating game");
      return;
    }

    socket.emit("coup createGame", privacyString);
  };

  const handleChange = (e) => {
    setNewChat(e.target.value);
  };

  const changePrivacy = () => {
    switch (privacy) {
      case lock:
        setPrivacy(unlock);
        break;
      case unlock:
        setPrivacy(lock);
        break;
      default:
        alert("error setting privacy");
        break;
    }
  };

  const selectPlayers = (e) => {
    setNumPlayers(e.target.value);
  };

  return (
    <div className="page">
      <div className="coupGrid">
        <div className="coupTile">
          <h3>Chats</h3>
          <div readOnly={true} className="coupText">
            {chats.map(displayChats)}
          </div>
          <textarea
            placeholder="Chat..."
            value={newChat}
            onChange={handleChange}
            style={{ width: "100%" }}
          ></textarea>
          <button style={{ width: "100%" }} onClick={sendChat}>
            Submit
          </button>
        </div>

        <div className="coupTile">
          <h3>Online Players</h3>
          <div
            readOnly={true}
            className="coupText"
            style={{
              textAlign: "center",
            }}
          >
            {onlineUsers.map(displayPlayers)}
          </div>
        </div>

        <div className="coupTile">
          <h3>Games</h3>
          <div
            readOnly={true}
            className="coupText"
            style={{
              textAlign: "center",
            }}
          >
            {games.map(displayGames)}
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 32px",
                gap: 10,
                gridAutoRows: "auto",
              }}
            >
              <p readOnly={true}>Number of Players</p>
              <select
                onChange={selectPlayers}
                value={numPlayers}
                style={{ height: 32 }}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              <p readOnly={true}>{privacy === unlock ? "Public" : "Private"}</p>
              <img
                onClick={changePrivacy}
                src={privacy}
                alt="privacy"
                style={{ height: 32, width: 32, cursor: "pointer" }}
              ></img>
            </div>
          </div>

          <button onClick={createGame} style={{ width: "100%" }}>
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
}
