"use client";

import { useState, KeyboardEvent } from "react";

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;
    onChange([...tags, tag]);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="rounded-lg border border-black px-3 py-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-black bg-pink-primary px-2 py-0.5 font-mono text-xs text-black"
          >
            {tag}
            <button
              type="button"
              className="leading-none hover:opacity-60"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length ? "" : "Type a tag and press Enter"}
          className="min-w-[120px] flex-1 bg-transparent font-mono text-sm text-black placeholder:text-black/40 focus:outline-none"
        />
      </div>
    </div>
  );
}
