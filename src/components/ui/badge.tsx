import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "inverse";
const tones: Record<Tone, string> = {
  neutral: "bg-bg-muted text-fg-muted border-border",
  accent: "bg-accent-soft text-accent-strong border-transparent dark:text-accent",
  success: "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  warning: "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  danger: "bg-red-50 text-red-800 border-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  inverse: "bg-white/10 text-white border-white/15",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

/** Étiquette de provenance d'une donnée : constructeur, observation documentée, avis éditorial. */
export function ProvenanceBadge({ kind }: { kind: "manufacturer" | "observed" | "editorial" | "unverified" }) {
  const map = {
    manufacturer: { label: "Donnée constructeur", tone: "neutral" as Tone },
    observed: { label: "Observation documentée", tone: "success" as Tone },
    editorial: { label: "Avis éditorial", tone: "accent" as Tone },
    unverified: { label: "Non vérifié", tone: "warning" as Tone },
  }[kind];
  return <Badge tone={map.tone}>{map.label}</Badge>;
}
