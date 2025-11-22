import React, { useEffect, useState } from "react";
import EmojiPicker from "./EmojiPicker.jsx";
import FileUpload from "./FileUpload.jsx";

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (!onTyping) return;
    if (text.length > 0) onTyping(true);
    const timeout = setTimeout(() => onTyping(false), 1000);
    return () => clearTimeout(timeout);
  }, [text]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend({ type: "text", text: text.trim() });
    setText("");
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
  };

  const handleFileSelected = ({ fileName, fileDataUrl }) => {
    onSend({ type: "file", fileName, fileDataUrl });
  };

  return (
    <form onSubmit={handleSend} className="relative flex items-center gap-2 mt-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className="px-2 text-lg"
          title="Emoji"
        >
          😊
        </button>
        {showEmoji && <EmojiPicker onSelect={handleEmojiSelect} />}
      </div>
      <FileUpload onFileSelected={handleFileSelected} />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Xabar yozing..."
        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
      />
      <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm">
        Yuborish
      </button>
    </form>
  );
}
