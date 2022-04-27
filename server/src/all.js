import * as dbUtils from "./utils/dbUtils.js";

const getUserObjHandler = async (socket, callback) => {
  const userObj = await dbUtils.getUserObj(socket.request.user.username);
  socket.request.user = userObj; // Update the user's socket
  callback(userObj); // Pass the userObj back to client
};

export const eventSwitch = async (event, socket, ...args) => {
  switch (event) {
    case "getUserObj":
      const callback = args[0];
      getUserObjHandler(socket, callback);
      break;
    default:
      throw "Not a valid 'all' event";
  }
};
