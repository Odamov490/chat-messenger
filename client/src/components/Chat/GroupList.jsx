import React, { useEffect, useState } from "react";
import { fetchGroups, createGroup } from "../../api/chatApi.js";

export default function GroupList({ activeRoomId, onChangeRoom }) {
  const [groups, setGroups] = useState([]);
  const [newName, setNewName] = useState("");

  const load = async () => {
    try {
      const { data } = await fetchGroups();
      setGroups(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const { data } = await createGroup(newName.trim());
      setGroups((prev) => [...prev, data]);
      setNewName("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 mb-1">Guruhlar</h3>
      <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => onChangeRoom(g.id)}
            className={`block w-full text-left px-2 py-1 rounded 
              ${activeRoomId === g.id ? "bg-slate-700" : "hover:bg-slate-800"}`}
          >
            #{g.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleCreate} className="flex gap-1">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Yangi guruh"
          className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
        />
        <button className="px-2 text-xs bg-slate-700 rounded">+ </button>
      </form>
    </div>
  );
}
