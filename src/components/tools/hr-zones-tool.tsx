"use client";
import { useMemo, useState } from "react";
import { zoneMethods, computeZones, estimateMaxHr, type ZoneMethod } from "@/lib/tools/hr-zones";
import { Field, Input } from "@/components/ui/form";

export function HrZonesTool() {
  const [method, setMethod] = useState<ZoneMethod>("max-percent");
  const [age, setAge] = useState("35");
  const [maxHr, setMaxHr] = useState("");
  const [restHr, setRestHr] = useState("55");
  const [lthr, setLthr] = useState("165");
  const meta = zoneMethods.find((m) => m.key === method)!;

  const effectiveMax = useMemo(() => {
    const m = Number(maxHr);
    if (Number.isFinite(m) && m > 0) return { value: m, estimated: false };
    const a = Number(age);
    try {
      return { value: estimateMaxHr(a), estimated: true };
    } catch {
      return null;
    }
  }, [maxHr, age]);

  const zones = useMemo(() => {
    try {
      if (method === "lthr") return { zones: computeZones("lthr", { lthr: Number(lthr) }) };
      if (!effectiveMax) return { error: "Indiquez un âge (10–100) ou une FC max mesurée." };
      return { zones: computeZones(method, { maxHr: effectiveMax.value, restHr: Number(restHr) }) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur." };
    }
  }, [method, lthr, effectiveMax, restHr]);

  const maxForBars = "zones" in zones && zones.zones ? zones.zones[zones.zones.length - 1].high : 200;

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Méthode</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {zoneMethods.map((m) => (
            <label key={m.key} className={`cursor-pointer rounded-xl border p-3 text-sm ${method === m.key ? "border-accent bg-accent-soft" : "border-border hover:border-fg"}`}>
              <input type="radio" name="method" value={m.key} checked={method === m.key} onChange={() => setMethod(m.key)} className="sr-only" />
              <span className="block font-medium">{m.label}</span>
              <span className="mt-1 block text-xs text-fg-muted">{m.formula}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-3">
        {method !== "lthr" && (
          <>
            <Field label="FC max mesurée (bpm)" htmlFor="maxHr" hint="Laisser vide pour estimer par 220 − âge."><Input id="maxHr" value={maxHr} onChange={(e) => setMaxHr(e.target.value)} inputMode="numeric" placeholder="Ex. 188" /></Field>
            <Field label="Âge" htmlFor="age" hint="Utilisé seulement si la FC max n'est pas saisie."><Input id="age" value={age} onChange={(e) => setAge(e.target.value)} inputMode="numeric" /></Field>
          </>
        )}
        {method === "karvonen" && <Field label="FC de repos (bpm)" htmlFor="restHr"><Input id="restHr" value={restHr} onChange={(e) => setRestHr(e.target.value)} inputMode="numeric" /></Field>}
        {method === "lthr" && <Field label="FC au seuil (bpm)" htmlFor="lthr" hint="Issue d'un test de terrain."><Input id="lthr" value={lthr} onChange={(e) => setLthr(e.target.value)} inputMode="numeric" /></Field>}
      </div>
      <div className="rounded-2xl bg-bg-muted p-4 text-sm text-fg-muted">
        <p><strong className="text-fg">Hypothèses :</strong> {meta.assumptions}</p>
        {method !== "lthr" && effectiveMax?.estimated && <p className="mt-1">FC max estimée à <strong>{effectiveMax.value} bpm</strong> (220 − âge) : une mesure réelle donne des zones plus fiables.</p>}
      </div>
      {"error" in zones ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{zones.error}</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <caption className="sr-only">Zones de fréquence cardiaque calculées</caption>
            <thead className="text-left text-xs uppercase tracking-[0.12em] text-fg-subtle">
              <tr><th className="py-2 pr-3">Zone</th><th className="py-2 pr-3">Objectif</th><th className="py-2 pr-3">%</th><th className="py-2 pr-3">bpm</th></tr>
            </thead>
            <tbody>
              {zones.zones.map((z) => (
                <tr key={z.index} className="border-t border-border">
                  <td className="py-2.5 pr-3 font-medium">{z.name}</td>
                  <td className="py-2.5 pr-3 text-fg-muted">{z.purpose}</td>
                  <td className="py-2.5 pr-3 tabular-nums">{Math.round(z.lowPct * 100)}–{Math.round(z.highPct * 100)} %</td>
                  <td className="py-2.5 pr-3 font-semibold tabular-nums">{z.low}–{z.high}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div role="img" aria-label="Visualisation des zones par plage de bpm" className="space-y-2">
            {zones.zones.map((z, i) => (
              <div key={z.index} className="flex items-center gap-3 text-xs">
                <span className="w-14 shrink-0 font-medium">Z{z.index}</span>
                <div className="relative h-6 flex-1 rounded bg-bg-muted">
                  <div className="absolute inset-y-0 rounded" style={{ left: `${(z.low / maxForBars) * 100}%`, width: `${((z.high - z.low) / maxForBars) * 100}%`, backgroundColor: ["#5a9bff", "#1d6ef5", "#1558c9", "#b45309", "#c02626"][i] }} />
                </div>
                <span className="w-20 shrink-0 tabular-nums text-fg-muted">{z.low}–{z.high}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-fg-subtle">Estimations à visée d'entraînement, sans valeur médicale. Elles ne reproduisent pas la méthode de votre appareil Garmin, qui peut utiliser d'autres paramètres.</p>
        </>
      )}
    </div>
  );
}
