import { io } from "./index.js";
let players = new Set();

export const addPlayer = (user) => {
  players.add(user);
};

export const removePlayer = (user) => {
  players.delete(user);
};

export const action = (user, action, target) => {
  console.log(`${user} called ${action} on ${target}`);
};

export const socketInit = (socket) => {
  socket.on("coup addPlayer", () => {
    addPlayer(socket.request.user.username); // add user to online coup user list
    io.emit("coup online", Array.from(players));
  });

  socket.on("coup removePlayer", () => {
    removePlayer(socket.request.user.username); // remove user from online coup user list
    io.emit("coup online", Array.from(players));
  });

  socket.on("coup action", (action, target) => {
    action(user, action, target);
  });
};
