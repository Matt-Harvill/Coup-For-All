import io from "socket.io-client";

let url;
if (process.env.NODE_ENV === "development") {
  // url = "http://localhost";
  url = "http://192.168.56.1";
} else {
  url = "https://www.mharvillgames.com";
}

export const socket = io(url, {
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
    // Get the user object on connecting
    socket.emit("all", "updateUserObj");
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
