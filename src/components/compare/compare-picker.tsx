"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { compareStore, COMPARE_MAX } from "./compare-store";

type Option = { slug: string; name: string; family: string; category: string };

export function ComparePicker({ options, selected }: { options: Option[]; selected: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // synchroniser la sélection locale (barre flottante) avec l'URL
  useEffect(() => {
    if (selected.length) {
      compareStore.clear();
      selected.forEach((s) => compareStore.toggle(s));
    }
  }, [selected]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const pool = options.filter((o) => !selected.includes(o.slug));
    if (!needle) return pool.slice(0, 8);
    return pool.filter((o) => o.name.toLowerCase().includes(needle) || o.family.toLowerCase().includes(needle)).slice(0, 8);
  }, [q, options, selected]);

  function navigate(next: string[]) {
    router.push(next.length ? `/comparer?m=${next.join(",")}` : "/comparer");
  }
  function add(slug: string) {
    if (selected.length >= COMPARE_MAX) return;
    setQ("");
    setOpen(false);
    navigate([...selected, slug]);
  }
  function remove(slug: string) {
    compareStore.remove(slug);
    navigate(selected.filter((s) => s !== slug));
  }
  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); setOpen(true); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && open && results[active]) { e.preventDefault(); add(results[active].slug); }
    else if (e.key === "Escape") setOpen(false);
  }
  const nameOf = (slug: string) => options.find((o) => o.slug === slug)?.name ?? slug;

  return (
    <div className="mt-8 max-w-3xl">
      <ul className="flex flex-wrap gap-2" aria-label="Modèles sélectionnés">
        {selected.map((s) => (
          <li key={s} className="inline-flex items-center gap-1 rounded-full bg-fg py-1.5 pl-3.5 pr-1.5 text-sm font-medium text-bg animate-fade">
            {nameOf(s)}
            <button type="button" onClick={() => remove(s)} aria-label={`Retirer ${nameOf(s)}`} className="inline-flex size-6 items-center justify-center rounded-full hover:bg-white/20">
              <X className="size-3.5" aria-hidden />
            </button>
          </li>
        ))}
        {selected.length === 0 && <li className="text-sm text-fg-subtle">Aucun modèle sélectionné.</li>}
      </ul>
      <div className="relative mt-4">
        <label htmlFor="compare-search" className="sr-only">Rechercher un modèle à ajouter</label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
        <input
          id="compare-search"
          role="combobox"
          aria-expanded={open}
          aria-controls="compare-results"
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `opt-${results[active].slug}` : undefined}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKey}
          disabled={selected.length >= COMPARE_MAX}
          placeholder={selected.length >= COMPARE_MAX ? `Maximum ${COMPARE_MAX} modèles` : "Ajouter un modèle (ex. Forerunner, fēnix, Edge)…"}
          className="h-12 w-full rounded-full border border-border-strong bg-bg pl-10 pr-4 text-[0.95rem] placeholder:text-fg-subtle focus:border-accent"
          autoComplete="off"
        />
        {open && results.length > 0 && (
          <ul id="compare-results" ref={listRef} role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-lg animate-fade">
            {results.map((o, i) => (
              <li key={o.slug} id={`opt-${o.slug}`} role="option" aria-selected={i === active}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(o.slug)} className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${i === active ? "bg-bg-muted" : "hover:bg-bg-muted"}`}>
                  <span className="font-medium">{o.name}</span>
                  <span className="text-xs text-fg-subtle">{o.family}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
