"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const QUICK = [
  { label: "Comparer deux montres", href: "/comparer" },
  { label: "Quel Garmin choisir ?", href: "/quel-garmin-choisir" },
  { label: "Inspecter un fichier GPX", href: "/outils/inspecteur-gpx-tcx" },
  { label: "Zones de fréquence cardiaque", href: "/outils/zones-frequence-cardiaque" },
  { label: "Guides pour débuter", href: "/guides" },
];

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setOpen(false);
    router.push(query ? `/recherche?q=${encodeURIComponent(query)}` : "/recherche");
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-3 text-sm text-fg-muted hover:bg-bg-muted hover:text-fg" aria-label="Rechercher (raccourci : /)" aria-haspopup="dialog">
        <Search className="size-4" aria-hidden />
        <span className="hidden md:inline">Rechercher</span>
        <kbd className="hidden rounded border border-border px-1.5 text-[10px] font-medium text-fg-subtle md:inline">/</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Recherche globale">
          <div className="absolute inset-0 bg-black/45 animate-fade" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 top-[12vh] w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-lg animate-reveal">
            <form onSubmit={submit} className="flex items-center gap-2 border-b border-border px-4">
              <Search className="size-5 text-fg-subtle" aria-hidden />
              <label htmlFor="global-search" className="sr-only">Rechercher un équipement, un guide, une discussion</label>
              <input id="global-search" ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Modèle, fonctionnalité, guide, discussion…" className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-fg-subtle" autoComplete="off" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer la recherche" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-bg-muted">
                <X className="size-4" aria-hidden />
              </button>
            </form>
            <div className="p-3">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">Accès rapides</p>
              <ul>
                {QUICK.map((s) => (
                  <li key={s.href}>
                    <button type="button" onClick={() => { setOpen(false); router.push(s.href); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-bg-muted">
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="px-2 pt-3 text-xs text-fg-subtle">Entrée pour lancer la recherche complète · Échap pour fermer</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
