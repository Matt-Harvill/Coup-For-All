import { useState, useEffect, useContext } from "react";
import CoupCreateGame from "../components/CoupCreateGame";
import { socket } from "../socket";
import unlock from "../images/unlock.png";
import "../styles/Coup.css";
import CoupGameContext from "../components/CoupGameContext";
import CoupJoinGame from "../components/CoupJoinGame";
import AppContext from "../components/AppContext";

export default function Coup() {
  const { userObj } = useContext(AppContext);

  const [newChat, setNewChat] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chats, setChats] = useState([]);

  // Create Game State Details
  const [games, setGames] = useState([]);
  const [privacy, setPrivacy] = useState(unlock);
  const [numPlayers, setNumPlayers] = useState("2");
  const [inGame, setInGame] = useState(false);
  const [ownsGame, setOwnsGame] = useState(false);
  const coupGameState = {
    games,
    setGames,
    inGame,
    setInGame,
    ownsGame,
    setOwnsGame,
    privacy,
    setPrivacy,
    numPlayers,
    setNumPlayers,
  };

  // Check if user has created a game or owns a game
  useEffect(() => {
    const userGame = games.find((game) =>
      game.players.includes(userObj.username)
    );

    if (userGame === undefined) {
      setInGame(false);
    } else {
      setInGame(true);
    }

    const founderOfGame = games.find(
      (game) => game.founder === userObj.username
    );

    if (founderOfGame === undefined) {
      setOwnsGame(false);
    } else {
      setOwnsGame(true);
    }
  }, [games, userObj.username]);

  // Setup coup socket listener
  useEffect(() => {
    socket.on("coup", (event, ...args) => {
      switch (event) {
        case "online":
          const users = args[0];
          setOnlineUsers(users);
          break;
        case "formingGames":
          const games = args[0];
          setGames(games);
          break;
        case "chat":
          const user = args[0];
          const message = args[1];
          setChats((oldChats) => [...oldChats, [user, message]]);
          break;
        default:
          break;
      }
    });

    socket.emit("coup", "playerOnline");
    socket.emit("coup", "formingGames");

    return () => {
      socket.off("coup"); // remove coup online listener
      socket.emit("coup", "playerOffline");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendChat = () => {
    socket.emit("coup", "chat", newChat);
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
    return <CoupJoinGame game={game} />;
  };

  const handleChange = (e) => {
    setNewChat(e.target.value);
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
        <CoupGameContext.Provider value={coupGameState}>
          <div className="coupTile">
            <h3>Games</h3>
            <div
              readOnly={true}
              className="coupText"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {games.map(displayGames)}
            </div>

            <CoupCreateGame />
          </div>
        </CoupGameContext.Provider>
      </div>
    </div>
  );
}
