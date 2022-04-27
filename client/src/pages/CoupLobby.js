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

  // Setup coup socket listeners
  useEffect(() => {
    // Temporary fix!!! {

    socket.on("online", (coup, users) => {
      setOnlineUsers(users);
    });

    socket.on("formingGames", (coup, games) => {
      setGames(games);
    });

    socket.on("chat", (coup, user, message) => {
      setChats((oldChats) => [...oldChats, [user, message]]);
    });

    // End of temporary fix }

    socket.emit("playerOnline", "coup");
    socket.emit("formingGames", "coup");

    return () => {
      socket.off("online", "coup"); // remove coup online listener
      socket.off("chat", "coup"); // remove chat listener
      socket.off("formingGames", "coup"); // remove games listener
      socket.emit("playerOffline", "coup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendChat = () => {
    socket.emit("chat", "coup", newChat);
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
