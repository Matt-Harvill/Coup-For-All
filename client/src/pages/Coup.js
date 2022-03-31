import { useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { socket } from "../socket";

export default function Coup() {
  const [newChat, setNewChat] = useState("");
  const { chats, user } = useContext(AppContext);

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
    <div>
      <h1>Coup Page</h1>

      <div>{chats.map(displayChats)}</div>

      <textarea
        placeholder="Chat..."
        value={newChat}
        onChange={handleChange}
      ></textarea>
      <button onClick={sendChat}>Submit</button>
    </div>
  );
}
