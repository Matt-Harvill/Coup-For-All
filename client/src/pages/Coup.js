import { useState, useContext, useEffect } from "react";
import AppContext from "../components/AppContext";
import { socket } from "../socket";
import "../styles/Coup.css";

export default function Coup() {
  const [newChat, setNewChat] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    socket.on("coup online", (users) => {
      setOnlineUsers(users);
    });

    socket.on("coup chat", (message) => {
      setChats((oldChats) => [...oldChats, message]);
    });

    socket.emit("coup addPlayer");

    return () => {
      socket.off("coup online"); // remove coup online listener
      socket.off("coup chat"); // remove chat listener
      socket.emit("coup removePlayer");
    };
  }, []);

  const sendChat = () => {
    socket.emit("coup chat", `${user}: ${newChat}`);
    setNewChat("");
  };

  const displayChats = (chat) => {
    return <p>{chat}</p>;
  };

  const parsePlayers = () => {
    let playerString = "";
    onlineUsers.forEach((user) => {
      playerString = playerString.concat(user, "\n");
    });
    return playerString;
  };

  const parseChats = () => {
    let chatString = "";
    chats.forEach((chat) => {
      chatString = chatString.concat(chat, "\n");
    });
    return chatString;
  };

  const handleChange = (e) => {
    setNewChat(e.target.value);
  };

  return (
    <div className="page">
      <div className="coupGrid">
        <div className="coupTile">
          <h3>Chats</h3>
          <textarea
            readOnly={true}
            style={{
              padding: 10,
              flex: 1,
              width: "100%",
              backgroundColor: "#f5f5f5",
            }}
            value={parseChats()}
          ></textarea>
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
          <textarea
            readOnly={true}
            style={{
              padding: 10,
              textAlign: "center",
              flex: 1,
              width: "100%",
              backgroundColor: "#f5f5f5",
            }}
            value={parsePlayers()}
          ></textarea>
        </div>

        <div className="coupTile">
          <h3>Games</h3>
          <div
            style={{
              padding: 10,
              flex: 1,
              width: "100%",
              backgroundColor: "#f5f5f5",
            }}
          ></div>
          <button style={{ width: "100%" }}>Create Game</button>
        </div>
      </div>
    </div>
  );
}
