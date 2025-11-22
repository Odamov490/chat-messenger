import bcrypt from "bcryptjs";

// In-memory user storage for demo
const users = [];

export function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

export function findUserById(id) {
  return users.find(u => u.id === id);
}

export async function createUser({ username, password }) {
  const existing = findUserByUsername(username);
  if (existing) throw new Error("User already exists");
  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    username,
    passwordHash: hash,
    avatarUrl: null
  };
  users.push(user);
  return user;
}

export async function validateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export function setUserAvatar(id, avatarUrl) {
  const user = findUserById(id);
  if (!user) return null;
  user.avatarUrl = avatarUrl;
  return user;
}
