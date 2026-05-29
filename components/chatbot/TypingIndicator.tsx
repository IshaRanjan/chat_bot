"use client";

import { cn } from "@/lib/utils";

export function TypingIndicator() {
  return (
    <div
      className="animate-message-in flex items-start gap-2"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        SB
      </div>
      <div className="bg-card border-border rounded-2xl rounded-tl-sm border px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "bg-muted-foreground/60 size-1.5 rounded-full",
                "animate-typing-dot"
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
