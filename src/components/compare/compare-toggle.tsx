"use client";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCompareList, compareStore } from "./compare-store";
import { cn } from "@/lib/utils/cn";

export function CompareToggle({ slug, name, className, size = "sm" }: { slug: string; name: string; className?: string; size?: "sm" | "md" }) {
  const list = useCompareList();
  const selected = list.includes(slug);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => {
          const r = compareStore.toggle(slug);
          setMsg(r.ok ? null : r.reason ?? null);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium transition",
          size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
          selected ? "border-accent bg-accent text-white" : "border-border bg-bg text-fg-muted hover:border-fg hover:text-fg",
          className,
        )}
      >
        {selected ? <Check className="size-3.5" aria-hidden /> : <Plus className="size-3.5" aria-hidden />}
        {selected ? "Sélectionné" : "Comparer"}
        <span className="sr-only"> — {name}</span>
      </button>
      {msg && <span role="status" className="mt-1 text-[11px] text-warning">{msg}</span>}
    </span>
  );
}
