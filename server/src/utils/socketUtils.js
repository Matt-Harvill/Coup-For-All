import * as dbUtils from "./dbUtils.js";
import { io } from "../index.js";

export const socketIDMap = {}; // Keep track of socket ids so they can be deleted
export const allOnlinePlayers = new Map(); // Keep track of all online players

// Can be used to update one socket and client or multiple
export const updateUserSocketAndClient = async (...players) => {
  // Loop through players and update their sockets and clients
  for (let i = 0; i < players.length; i++) {
    const userSocketID = socketIDMap[players[i]];
    // If userSocketID is defined (will be undefined if user isn't currently connected)
    if (userSocketID !== undefined) {
      const socket = io.sockets.sockets.get(userSocketID);
      const userObj = await dbUtils.getUserObj(socket.request.user.username);
      socket.request.user = userObj; // Update the socket's user object
      socket.emit("updateUserObj", userObj); // Inform client of update
    }
  }
};
