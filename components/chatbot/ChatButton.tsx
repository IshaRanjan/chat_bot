"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close support chat" : "Open support chat"}
      className={cn(
        "bg-primary text-primary-foreground fixed right-4 bottom-4 z-50",
        "flex size-14 items-center justify-center rounded-full shadow-lg",
        "transition-all duration-300 hover:scale-105 hover:shadow-xl",
        "focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:outline-none",
        "sm:right-6 sm:bottom-6",
        isOpen && "scale-0 opacity-0 pointer-events-none"
      )}
    >
      <MessageCircle className="size-7" aria-hidden />
    </button>
  );
}
