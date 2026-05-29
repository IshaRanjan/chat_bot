"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  Category,
  ChatMessage as ChatMessageType,
  FaqQuestion,
  Subcategory,
} from "@/lib/chatbot/types";
import { ChatMessage } from "./ChatMessage";
import { OptionChips } from "./OptionChips";
import { TypingIndicator } from "./TypingIndicator";

type OptionItem = Category | Subcategory | FaqQuestion;

interface ChatMessagesProps {
  messages: ChatMessageType[];
  options: OptionItem[];
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;
  onOptionSelect: (item: OptionItem) => void;
}

export function ChatMessages({
  messages,
  options,
  isTyping,
  isLoading,
  error,
  onOptionSelect,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, options, error]);

  return (
    <ScrollArea className="min-h-0 flex-1 px-4">
      <div className="flex flex-col gap-3 py-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        {error && (
          <p
            className="text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-xs"
            role="alert"
          >
            {error}
          </p>
        )}
        <OptionChips
          options={options}
          onSelect={onOptionSelect}
          disabled={isLoading || isTyping}
        />
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
