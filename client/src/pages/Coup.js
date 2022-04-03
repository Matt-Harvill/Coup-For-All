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
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Coup Page</h1>

        <div>{chats.map(displayChats)}</div>

        <textarea
          placeholder="Chat..."
          value={newChat}
          onChange={handleChange}
        ></textarea>
        <button onClick={sendChat}>Submit</button>

        <h3>Online users</h3>
        <div>{onlineUsers.map(displayChats)}</div>
      </div>
    </div>
  );
}
