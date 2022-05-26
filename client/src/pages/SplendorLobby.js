import { useState, useEffect, useContext } from "react";
import { socket } from "../socket";
import unlock from "../images/unlock.png";
import "../styles/Splendor.css";
import SplendorCreateGame from "../components/splendor/SplendorCreateGame";
import SplendorLobbyGamesContext from "../components/splendor/SplendorLobbyGamesContext";
import SplendorJoinGame from "../components/splendor/SplendorJoinGame";
import AppContext from "../components/AppContext";

export default function SplendorLobby() {
  const { userObj } = useContext(AppContext);

  const chatClipSize = 120;
  const [newChat, setNewChat] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chats, setChats] = useState([]);

  // Create Game State Details
  const [games, setGames] = useState([]);
  const [privacy, setPrivacy] = useState(unlock);
  const [numPlayers, setNumPlayers] = useState("2");
  const [inGame, setInGame] = useState(false);
  const [ownsGame, setOwnsGame] = useState(false);
  const splendorGameState = {
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
    const userGame = games.find((game) => {
      return game.players.includes(userObj.username);
    });

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

  // Setup splendor socket listener
  useEffect(() => {
    socket.on("splendor", (event, ...args) => {
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

    socket.emit("splendor", "playerOnline");
    socket.emit("splendor", "formingGames");

    return () => {
      socket.off("splendor"); // remove splendor online listener
      socket.emit("splendor", "playerOffline");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendChat = () => {
    socket.emit("splendor", "chat", newChat);
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
    return <SplendorJoinGame game={game} />;
  };

  const handleChange = (e) => {
    const chatString = e.target.value;
    const restrictedSizeString = chatString.substring(0, chatClipSize);
    setNewChat(restrictedSizeString);
  };

  return (
    <div className="page splendorPage">
      <h1 style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>
        Splendor Lobby
      </h1>
      <div className="splendorGrid">
        <div className="splendorTile">
          <h3>Chats</h3>
          <div readOnly={true} className="splendorText">
            {chats.map(displayChats)}
          </div>
          <textarea
            placeholder="Chat..."
            value={newChat}
            onChange={handleChange}
            style={{ width: "100%" }}
          ></textarea>
          {newChat.length === chatClipSize && (
            <p style={{ color: "#14FFEC" }}>
              Max characters reached ({chatClipSize})
            </p>
          )}
          <button style={{ width: "100%" }} onClick={sendChat}>
            Submit
          </button>
        </div>

        <div className="splendorTile">
          <h3>Online Players</h3>
          <div
            readOnly={true}
            className="splendorText"
            style={{
              textAlign: "center",
            }}
          >
            {onlineUsers.map(displayPlayers)}
          </div>
        </div>
        <SplendorLobbyGamesContext.Provider value={splendorGameState}>
          <div className="splendorTile">
            <h3>Games</h3>
            <div
              readOnly={true}
              className="splendorText"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {games.map(displayGames)}
            </div>

            <SplendorCreateGame />
          </div>
        </SplendorLobbyGamesContext.Provider>
      </div>
    </div>
  );
}
