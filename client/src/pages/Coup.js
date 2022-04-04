import { useState, useContext, useEffect } from "react";
import AppContext from "../components/AppContext";
import { socket } from "../socket";

export default function Coup() {
  const [newChat, setNewChat] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { chats, user } = useContext(AppContext);

  useEffect(() => {
    socket.on("coup online", (users) => {
      setOnlineUsers(users);
    });

    socket.emit("coup addPlayer");

    return () => {
      socket.off("coup online"); // remove coup online listener
      socket.emit("coup removePlayer");
    };
  }, []);

  const sendChat = () => {
    socket.emit("chat message", `${user}: ${newChat}`);
    setNewChat("");
  };

  const displayChats = (chat) => {
    return <p>{chat}</p>;
  };

  const handleChange = (e) => {
    setNewChat(e.target.value);
  };

  return (
    <div className="page">
      <h1 style={{ width: "100%", textAlign: "center" }}>Coup Page</h1>

      <div
        style={{
          textAlign: "center",
          position: "absolute",
          top: 150,
          left: 100,
          minWidth: 300,
          minHeight: 200,
          border: "solid",
          borderWidth: 2,
        }}
      >
        <h3>Chats</h3>
        <div>{chats.map(displayChats)}</div>
      </div>

      <div
        style={{
          textAlign: "center",
          position: "absolute",
          top: 150,
          left: 450,
          minWidth: 300,
          minHeight: 200,
          border: "solid",
          borderWidth: 2,
        }}
      >
        <h3>Online Players</h3>
        <div>{onlineUsers.map(displayChats)}</div>
      </div>

      <div
        style={{
          textAlign: "center",
          position: "absolute",
          top: 150,
          left: 800,
          minWidth: 300,
          minHeight: 200,
          border: "solid",
          borderWidth: 2,
        }}
      >
        <h3>New Chat</h3>
        <textarea
          placeholder="Chat..."
          value={newChat}
          onChange={handleChange}
        ></textarea>
        <button onClick={sendChat}>Submit</button>
      </div>
    </div>
  );
}
