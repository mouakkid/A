"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { site } from "@/config/site";
import { BrandBlock } from "@/components/brand/brand-block";
import { cn } from "@/lib/utils/cn";

export function MobileNav({ items, user }: { items: NavItem[]; user: { username: string } | null }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocus = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFocus.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="menu-mobile" className="inline-flex size-10 items-center justify-center rounded-full hover:bg-bg-muted lg:hidden">
        <Menu className="size-5" aria-hidden />
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu principal">
          <div className="absolute inset-0 bg-black/40 animate-fade" onClick={() => setOpen(false)} />
          <div ref={panelRef} id="menu-mobile" className="absolute inset-y-0 left-0 flex w-[min(22rem,90vw)] flex-col bg-bg shadow-lg animate-reveal">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <BrandBlock size="sm" withLink={false} />
              <button ref={firstFocus} type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" className="inline-flex size-10 items-center justify-center rounded-full hover:bg-bg-muted">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <p className="border-b border-border px-4 py-2 text-[11px] font-medium text-fg-muted">{site.independence.short}</p>
            <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Navigation mobile">
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.groups ? (
                      <>
                        <button type="button" aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-semibold hover:bg-bg-muted">
                          {item.label}
                          <ChevronDown className={cn("size-4 transition-transform", expanded === item.label && "rotate-180")} aria-hidden />
                        </button>
                        {expanded === item.label && (
                          <div className="pb-2 pl-3">
                            <Link href={item.href} className="block rounded-md px-3 py-2 text-sm font-medium text-accent-strong dark:text-accent">Voir tout : {item.label}</Link>
                            {item.groups.map((g) => (
                              <div key={g.title} className="mt-1">
                                <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">{g.title}</p>
                                <ul>
                                  {g.links.map((l) => (
                                    <li key={l.href}>
                                      <Link href={l.href} className="block rounded-md px-3 py-2 text-sm text-fg-muted hover:bg-bg-muted hover:text-fg">{l.label}</Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} className="block rounded-lg px-3 py-3 text-base font-semibold hover:bg-bg-muted">{item.label}</Link>
                    )}
                  </li>
                ))}
                <li className="mt-3 border-t border-border pt-3">
                  <Link href="/comparer" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-bg-muted">Comparateur</Link>
                  <Link href="/quel-garmin-choisir" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-bg-muted">Quel Garmin choisir ?</Link>
                  <Link href="/recherche" className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-bg-muted">Recherche</Link>
                </li>
              </ul>
            </nav>
            <div className="border-t border-border p-4">
              {user ? (
                <Link href="/compte" className="block rounded-full border border-border px-4 py-2.5 text-center text-sm font-semibold">Mon compte ({user.username})</Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/connexion" className="rounded-full bg-fg px-4 py-2.5 text-center text-sm font-semibold text-bg">Connexion</Link>
                  <Link href="/inscription" className="rounded-full border border-border px-4 py-2.5 text-center text-sm font-semibold">Inscription</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
