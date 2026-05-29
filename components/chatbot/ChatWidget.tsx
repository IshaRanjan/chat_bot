"use client";

import { useChatbot } from "@/hooks/useChatbot";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";

export type UseChatbotReturn = ReturnType<typeof useChatbot>;

export function ChatWidget() {
  const chat = useChatbot();

  const toggleChat = () => {
    if (chat.isOpen) {
      chat.closeChat();
    } else {
      chat.openChat();
    }
  };

  return (
    <>
      <ChatButton isOpen={chat.isOpen} onClick={toggleChat} />
      <ChatWindow
        isOpen={chat.isOpen}
        botName={chat.botName}
        closeChat={chat.closeChat}
        messages={chat.messages}
        options={chat.options}
        isTyping={chat.isTyping}
        isLoading={chat.isLoading}
        error={chat.error}
        handleOptionSelect={chat.handleOptionSelect}
        resetFlow={chat.resetFlow}
      />
    </>
  );
}
