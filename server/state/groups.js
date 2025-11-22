// Very simple in-memory groups
const groups = [
  { id: "general", name: "General chat" }
];

export function listGroups() {
  return groups;
}

export function createGroup(name) {
  const id = "grp_" + Date.now().toString();
  const group = { id, name };
  groups.push(group);
  return group;
}
