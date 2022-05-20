import { sendUpdatesSingle } from "./utils/socketUtils.js";

export const eventSwitch = async (event, socket, ...args) => {
  switch (event) {
    case "updateUserObj":
      if (socket.request.user) {
        await sendUpdatesSingle(socket.request.user.username);
      }
      break;
    default:
      throw "Not a valid 'all' event";
  }
};
