import io from "socket.io-client";

let url;
if (process.env.NODE_ENV === "development") {
  url = "localhost";
} else {
  url = "websocket-game-website.herokuapp.com";
}

const socket = io(`http://${url}:80`, {
  transports: ["websocket"],
});

export const socketInit = (appState) => {
  socket.connect();

  socket.on("chat message", (message) => {
    appState.setChats((oldChats) => [...oldChats, message]);
  });

  socket.on("connect_error", (err) => {
    if (err.message === "unauthorized") {
      alert("Unauthorized");
      appState.setAuth("no auth");
    } else {
      alert("Socket Connection Issues");
    }
    setTimeout(() => {
      socket.connect();
    }, 5000);
  });

  socket.on("connect", () => {
    appState.setAuth("auth");
  });
};
