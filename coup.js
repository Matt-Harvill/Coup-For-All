let coupOnlineUsers = new Set();

export const coupOnline = () => {
  return coupOnlineUsers;
};

export const coupUserAdd = (user) => {
  coupOnlineUsers.add(user);
};

export const coupUserRemove = (user) => {
  coupOnlineUsers.delete(user);
};

export const coupAction = (user, action, target) => {
  console.log(`${user} called ${action} on ${target}`);
};
