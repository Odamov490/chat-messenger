import React from "react";

const emojis = ["😀", "😂", "😍", "😎", "😭", "👍", "🙏", "🔥", "❤️", "🤯", "🤔", "👀"];

export default function EmojiPicker({ onSelect }) {
  return (
    <div className="absolute bottom-full mb-2 bg-slate-800 border border-slate-700 rounded p-2 flex flex-wrap w-48">
      {emojis.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onSelect(e)}
          className="text-xl m-1 hover:scale-110 transition"
        >
          {e}
        </button>
      ))}
    </div>
  );
}
