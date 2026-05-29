"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UseChatbotReturn } from "./ChatWidget";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";

type ChatWindowProps = Pick<
  UseChatbotReturn,
  | "botName"
  | "closeChat"
  | "messages"
  | "options"
  | "isTyping"
  | "isLoading"
  | "error"
  | "handleOptionSelect"
  | "resetFlow"
> & {
  isOpen: boolean;
};

export function ChatWindow({
  isOpen,
  botName,
  closeChat,
  messages,
  options,
  isTyping,
  isLoading,
  error,
  handleOptionSelect,
  resetFlow,
}: ChatWindowProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "animate-chat-open fixed z-50 flex flex-col overflow-hidden",
        "bg-card border-border rounded-xl border shadow-2xl",
        "right-4 bottom-4 h-[min(560px,calc(100dvh-6rem))] w-[min(100vw-2rem,400px)]",
        "sm:right-6 sm:bottom-6"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Support chat"
    >
      <ChatHeader botName={botName} onClose={closeChat} />
      <ChatMessages
        messages={messages}
        options={options}
        isTyping={isTyping}
        isLoading={isLoading}
        error={error}
        onOptionSelect={handleOptionSelect}
      />
      <footer className="border-border bg-muted/40 flex shrink-0 items-center justify-between gap-2 border-t px-4 py-2.5">
        {isLoading && (
          <span className="text-muted-foreground text-xs">Loading…</span>
        )}
        {!isLoading && <span className="text-muted-foreground text-xs" />}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-8 gap-1.5 text-xs"
          onClick={() => void resetFlow()}
          disabled={isLoading || isTyping}
        >
          <RotateCcw className="size-3.5" />
          Start over
        </Button>
      </footer>
    </div>
  );
}
