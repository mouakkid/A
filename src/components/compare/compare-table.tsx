"use client";
import { useState } from "react";
import Link from "next/link";
import { Link2, Check } from "lucide-react";
import type { CompareGroup } from "@/lib/catalog/compare";
import { SpecValue } from "@/components/catalog/spec-value";
import { cn } from "@/lib/utils/cn";

export function CompareTable({ devices, groups, summary, shareUrl }: { devices: { slug: string; name: string; category: string }[]; groups: CompareGroup[]; summary: string[]; shareUrl: string }) {
  const [onlyDiff, setOnlyDiff] = useState(true);
  const [copied, setCopied] = useState(false);
  const visibleGroups = groups.map((g) => ({ ...g, rows: g.rows.filter((r) => !onlyDiff || r.differs) })).filter((g) => g.rows.length > 0);
  const totalDiff = groups.reduce((n, g) => n + g.rows.filter((r) => r.differs).length, 0);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="space-y-10">
      {summary.length > 0 && (
        <section aria-labelledby="diff-summary" className="rounded-2xl bg-graphite-900 p-6 text-white bg-topo sm:p-8">
          <h2 id="diff-summary" className="text-xl font-bold">Différences décisives</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {summary.map((s) => (
              <li key={s} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{s}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/55">Aucun modèle n'est « le meilleur » dans l'absolu : le bon choix dépend de votre sport, de votre budget et de vos priorités.</p>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} className="size-4" />
          Afficher uniquement les différences ({totalDiff})
        </label>
        <button type="button" onClick={copy} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-sm font-medium hover:bg-bg-muted">
          {copied ? <Check className="size-4 text-success" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
          {copied ? "Lien copié" : "Copier le lien de cette comparaison"}
        </button>
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <table className="compare-table w-full min-w-[40rem] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className="w-48 py-3 pr-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">Caractéristique</th>
              {devices.map((d) => (
                <th key={d.slug} scope="col" className="min-w-40 py-3 pr-4 text-left align-bottom">
                  <Link href={`/equipements/${d.slug}`} className="text-base font-bold leading-tight underline-offset-4 hover:underline">{d.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          {visibleGroups.map((g) => (
            <tbody key={g.key}>
              <tr>
                <th scope="rowgroup" colSpan={devices.length + 1} className="bg-bg-muted px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">{g.title}</th>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.key} className={cn("transition-colors", r.differs ? "bg-accent-soft/40" : "")}>
                  <th scope="row" className="border-b border-border py-3 pr-4 text-left font-medium text-fg-muted">
                    {r.label}
                    {r.hint && <span className="block text-xs font-normal text-fg-subtle">{r.hint}</span>}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={devices[i].slug} className="border-b border-border py-3 pr-4 align-top"><SpecValue cell={c} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      {visibleGroups.length === 0 && <p className="text-fg-muted">Aucune différence connue entre ces modèles sur les caractéristiques suivies. Décochez le filtre pour voir toutes les valeurs.</p>}
      <p className="text-xs text-fg-subtle">Données constructeur telles que lues sur les fiches officielles, avec date de vérification sur chaque fiche. Les prix sont des prix de référence sur le marché indiqué, pas des prix constatés au Maroc.</p>
    </div>
  );
}
