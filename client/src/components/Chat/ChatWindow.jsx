import React from "react";
import MessageList from "./MessageList.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageInput from "./MessageInput.jsx";
import { useChat } from "../../hooks/useChat.js";

export default function ChatWindow({ activeRoomId }) {
  const { messages, sendMessage, typingUsers, sendTyping } = useChat(activeRoomId);

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <TypingIndicator typingUsers={typingUsers} />
      <MessageInput onSend={sendMessage} onTyping={sendTyping} />
    </div>
  );
}
