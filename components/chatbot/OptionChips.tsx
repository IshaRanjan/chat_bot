"use client";

import { Button } from "@/components/ui/button";
import type {
  Category,
  FaqQuestion,
  Subcategory,
} from "@/lib/chatbot/types";

type OptionItem = Category | Subcategory | FaqQuestion;

function getLabel(item: OptionItem): string {
  if ("question" in item) return item.question;
  return item.name;
}

interface OptionChipsProps {
  options: OptionItem[];
  onSelect: (item: OptionItem) => void;
  disabled?: boolean;
}

export function OptionChips({ options, onSelect, disabled }: OptionChipsProps) {
  if (options.length === 0) return null;

  return (
    <div
      className="animate-message-in flex flex-wrap gap-2 pt-1"
      role="group"
      aria-label="Select an option"
    >
      {options.map((item) => (
        <Button
          key={item.id}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-auto min-h-8 max-w-full whitespace-normal rounded-full px-3 py-1.5 text-left text-xs font-normal"
          onClick={() => onSelect(item)}
        >
          {getLabel(item)}
        </Button>
      ))}
    </div>
  );
}
