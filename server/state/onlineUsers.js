export const usersOnline = {};

export function registerOnlineUser(user, socketId) {
  usersOnline[user.id] = socketId;
}

export function removeOnlineUser(userId) {
  delete usersOnline[userId];
}

export function getOnlineUsers() {
  return Object.entries(usersOnline).map(([userId, socketId]) => ({
    id: userId,
    socketId
  }));
}
