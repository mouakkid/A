"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function MegaMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const wrapRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const closeTimer = useRef<number | null>(null);

  // Fermer le menu lors d'un changement de route (dérivé pendant le rendu, sans effet).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, []);

  function scheduleClose() {
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  }
  function cancelClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }

  return (
    <ul ref={wrapRef} className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const isOpen = open === item.label;
        if (!item.groups) {
          return (
            <li key={item.label}>
              <Link href={item.href} className={cn("inline-flex h-10 items-center rounded-full px-3.5 text-sm font-medium transition hover:bg-bg-muted", active ? "text-fg" : "text-fg-muted hover:text-fg")}>
                {item.label}
              </Link>
            </li>
          );
        }
        return (
          <li key={item.label} className="relative" onPointerEnter={() => { cancelClose(); setOpen(item.label); }} onPointerLeave={scheduleClose}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`menu-${item.label}`}
              onClick={() => setOpen(isOpen ? null : item.label)}
              className={cn("inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-sm font-medium transition hover:bg-bg-muted", active || isOpen ? "text-fg" : "text-fg-muted hover:text-fg")}
            >
              {item.label}
              <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
            </button>
            <div
              id={`menu-${item.label}`}
              hidden={!isOpen}
              className="absolute left-1/2 top-full z-40 w-[min(56rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 animate-fade"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-lg">
                <div className={cn("grid gap-0", item.featured ? "lg:grid-cols-[1fr_1fr_1.1fr]" : "lg:grid-cols-2")}>
                  {item.groups.map((g) => (
                    <div key={g.title} className="p-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-fg-subtle">{g.title}</p>
                      <ul className="space-y-1">
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} className="group flex flex-col rounded-lg px-2 py-1.5 hover:bg-bg-muted" onClick={() => setOpen(null)}>
                              <span className="text-sm font-medium text-fg">{l.label}</span>
                              {l.description && <span className="text-xs text-fg-subtle">{l.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {item.featured && (
                    <div className="flex flex-col justify-between bg-graphite-900 p-6 text-white bg-topo">
                      <div>
                        <p className="text-base font-semibold leading-snug">{item.featured.title}</p>
                        <p className="mt-2 text-sm text-white/70">{item.featured.description}</p>
                      </div>
                      <Link href={item.featured.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline" onClick={() => setOpen(null)}>
                        {item.featured.cta}
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border px-6 py-3">
                  <Link href={item.href} className="text-sm font-semibold text-accent-strong hover:underline dark:text-accent" onClick={() => setOpen(null)}>
                    Voir tout : {item.label}
                  </Link>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
