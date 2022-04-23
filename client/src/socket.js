import io from "socket.io-client";

let url;
if (process.env.NODE_ENV === "development") {
  url = "localhost";
} else {
  url = "game-website-sockets.herokuapp.com";
}

export const socket = io(`http://${url}:80`, {
  transports: ["websocket"],
});

export const socketInit = (appState) => {
  socket.connect();

  socket.on("connect_error", (err) => {
    if (err.message === "unauthorized") {
      appState.setAuth("no auth");
    } else {
      alert("Socket Connection Issues");
      setTimeout(() => {
        socket.connect();
      }, 1000);
    }
  });

  socket.on("connect", () => {
    appState.setAuth("auth");
    socket.emit("get userObj", (callback) => {
      let fullUserObj = callback;
      // Only take properties that are necessary
      const userObj = {
        username: fullUserObj.username,
        gameTitle: fullUserObj.gameTitle,
        gameID: fullUserObj.gameID,
        gameStatus: fullUserObj.gameStatus,
        pStat: fullUserObj.pStat,
      };
      appState.setUserObj(userObj);
    });
  });

  socket.on("disconnect", () => {
    appState.setAuth("no auth");
    appState.setUserObj({
      username: "",
      gameTitle: "",
      gameID: "",
      gameStatus: "",
      pStat: {},
    });
    socket.connect();
  });
};
