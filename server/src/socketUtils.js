import * as dbUtils from "./dbUtils.js";

export const updateUserSocketAndClient = async (socket) => {
  const userObj = await dbUtils.getUserObj(socket.request.user.username);
  socket.request.user = userObj; // Update the socket's user object
  socket.emit("updateUserObj", userObj); // Inform client of update
};
