"use client";
import { useMemo, useState } from "react";
import { standardDistances, parseDuration, formatDuration, formatPace } from "@/lib/tools/pace";
import { buildStrategy, strategySummary, type StrategyKind } from "@/lib/tools/race-strategy";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function RaceStrategyTool() {
  const [distKey, setDistKey] = useState("marathon");
  const [customKm, setCustomKm] = useState("");
  const [target, setTarget] = useState("3:45:00");
  const [kind, setKind] = useState<StrategyKind>("negative");
  const [pct, setPct] = useState("2");
  const [adjust, setAdjust] = useState<Record<number, string>>({});

  const distanceM = distKey === "custom" ? Number(customKm.replace(",", ".")) * 1000 : standardDistances.find((d) => d.key === distKey)!.meters;

  const result = useMemo(() => {
    const t = parseDuration(target);
    if (!t || t <= 0) return { error: "Temps cible invalide (h:mm:ss)." };
    if (!Number.isFinite(distanceM) || distanceM <= 0) return { error: "Distance invalide." };
    if (distanceM > 300_000) return { error: "Distance trop grande pour cet outil (300 km max)." };
    const manual: Record<number, number> = {};
    for (const [k, v] of Object.entries(adjust)) {
      const s = parseDuration(v);
      if (s && s > 0) manual[Number(k)] = s;
    }
    try {
      const segs = buildStrategy(distanceM, t, kind, { negativeSplitPct: Number(pct) || 0, manualAdjustments: manual });
      return { segs, summary: strategySummary(segs), targetSec: t };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur." };
    }
  }, [target, distanceM, kind, pct, adjust]);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Distance" htmlFor="dist">
          <Select id="dist" value={distKey} onChange={(e) => setDistKey(e.target.value)}>
            {standardDistances.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            <option value="custom">Distance libre (km)</option>
          </Select>
        </Field>
        {distKey === "custom" && <Field label="Km" htmlFor="km"><Input id="km" value={customKm} onChange={(e) => setCustomKm(e.target.value)} inputMode="decimal" /></Field>}
        <Field label="Temps cible" htmlFor="target" hint="h:mm:ss"><Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} inputMode="numeric" /></Field>
        <Field label="Stratégie" htmlFor="kind">
          <Select id="kind" value={kind} onChange={(e) => setKind(e.target.value as StrategyKind)}>
            <option value="even">Allure régulière</option>
            <option value="negative">Negative split</option>
          </Select>
        </Field>
        {kind === "negative" && <Field label="Écart (%)" htmlFor="pct" hint="Première moitié plus lente de X %, seconde plus rapide de X %."><Input id="pct" value={pct} onChange={(e) => setPct(e.target.value)} inputMode="decimal" /></Field>}
      </div>
      {"error" in result ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{result.error}</p>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-3" aria-live="polite">
            {[
              ["Temps total du plan", result.summary.totalLabel, Math.abs(result.summary.totalSec - result.targetSec) > 1 ? `Écart avec la cible : ${result.summary.totalSec > result.targetSec ? "+" : "−"}${formatDuration(Math.abs(result.summary.totalSec - result.targetSec))} (ajustements manuels)` : "Conforme à la cible"],
              ["Première moitié", formatDuration(result.summary.firstHalfSec), ""],
              ["Seconde moitié", formatDuration(result.summary.secondHalfSec), ""],
            ].map(([k, v, note]) => (
              <div key={k} className="rounded-2xl border border-border p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">{k}</dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{v}</dd>
                {note && <dd className="mt-1 text-xs text-fg-muted">{note}</dd>}
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Passages</h2>
            {Object.keys(adjust).length > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => setAdjust({})}>Réinitialiser les ajustements</Button>}
          </div>
          <div className="max-h-[32rem] overflow-auto rounded-2xl border border-border">
            <table className="w-full text-sm tabular-nums">
              <thead className="sticky top-0 bg-bg-muted text-left text-xs uppercase tracking-[0.12em] text-fg-subtle">
                <tr><th className="px-3 py-2">Passage</th><th className="px-3 py-2">Allure</th><th className="px-3 py-2">Ajuster (mm:ss)</th><th className="px-3 py-2">Segment</th><th className="px-3 py-2">Cumulé</th></tr>
              </thead>
              <tbody>
                {result.segs.map((s) => (
                  <tr key={s.index} className="border-t border-border">
                    <td className="px-3 py-1.5">{s.label}</td>
                    <td className="px-3 py-1.5">{formatPace(s.secPerKm)}</td>
                    <td className="px-3 py-1.5">
                      <label className="sr-only" htmlFor={`adj-${s.index}`}>Allure manuelle pour {s.label}</label>
                      <input id={`adj-${s.index}`} value={adjust[s.index] ?? ""} onChange={(e) => setAdjust((a) => ({ ...a, [s.index]: e.target.value }))} placeholder="—" className="h-8 w-20 rounded border border-border bg-bg px-2 text-sm" inputMode="numeric" />
                    </td>
                    <td className="px-3 py-1.5">{formatDuration(s.segmentSec)}</td>
                    <td className="px-3 py-1.5 font-medium">{formatDuration(s.cumulativeSec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-fg-subtle">Répartition arithmétique d'un temps que vous choisissez : l'outil ne prédit pas votre performance réelle et ne tient pas compte du profil, de la météo ni de la fatigue.</p>
        </>
      )}
    </div>
  );
}
