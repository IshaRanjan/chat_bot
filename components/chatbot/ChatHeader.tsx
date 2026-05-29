"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  botName: string;
  onClose: () => void;
}

export function ChatHeader({ botName, onClose }: ChatHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground flex shrink-0 items-center justify-between gap-3 rounded-t-xl px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{botName}</p>
        <p className="text-primary-foreground/80 text-xs">
          Banking support · FAQ
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground shrink-0"
        aria-label="Close chat"
      >
        <X className="size-5" />
      </Button>
    </header>
  );
}
