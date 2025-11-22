import client from "./authApi.js";

export function fetchGroups() {
  return client.get("/api/groups");
}

export function createGroup(name) {
  return client.post("/api/groups", { name });
}
