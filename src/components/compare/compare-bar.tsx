"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Scale } from "lucide-react";
import { useCompareList, compareStore, COMPARE_MAX } from "./compare-store";

/** Barre flottante de sélection des modèles à comparer (persistée localement). */
export function CompareBar() {
  const list = useCompareList();
  const pathname = usePathname();
  if (list.length === 0 || pathname.startsWith("/comparer")) return null;
  const href = `/comparer?m=${list.map(encodeURIComponent).join(",")}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5 pointer-events-none" role="region" aria-label="Sélection pour le comparateur">
      <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-graphite-900/95 p-2.5 pl-4 text-white shadow-lg backdrop-blur animate-reveal">
        <Scale className="hidden size-5 text-accent sm:block" aria-hidden />
        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5" aria-live="polite">
          {list.map((slug) => (
            <li key={slug} className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/10 py-1 pl-3 pr-1 text-xs font-medium">
              <span className="truncate">{slug.replace(/-/g, " ")}</span>
              <button type="button" onClick={() => compareStore.remove(slug)} aria-label={`Retirer ${slug} de la comparaison`} className="inline-flex size-5 items-center justify-center rounded-full hover:bg-white/20">
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
          {list.length < COMPARE_MAX && <li className="py-1 text-xs text-white/50">{list.length}/{COMPARE_MAX}</li>}
        </ul>
        <button type="button" onClick={() => compareStore.clear()} className="hidden text-xs text-white/60 hover:text-white sm:block">Vider</button>
        <Link href={list.length >= 2 ? href : "/comparer"} aria-disabled={list.length < 2} className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold ${list.length >= 2 ? "bg-accent text-white hover:bg-accent-strong" : "bg-white/10 text-white/50"}`}>
          Comparer{list.length >= 2 ? ` (${list.length})` : ""}
        </Link>
      </div>
    </div>
  );
}
