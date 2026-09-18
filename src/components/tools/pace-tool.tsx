"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link2 } from "lucide-react";
import { standardDistances, paceSecPerKmFromSpeedKmh, speedKmhFromPaceSecPerKm, paceSecPerMileFromSecPerKm, timeForDistance, paceForTarget, formatDuration, formatPace, parseDuration, splitsForDistance } from "@/lib/tools/pace";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type Mode = "pace" | "speed" | "target";

export function PaceTool() {
  const sp = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>((sp.get("mode") as Mode) || "pace");
  const [pace, setPace] = useState(sp.get("allure") ?? "5:00");
  const [speed, setSpeed] = useState(sp.get("vitesse") ?? "12");
  const [distKey, setDistKey] = useState(sp.get("d") ?? "10k");
  const [customKm, setCustomKm] = useState(sp.get("km") ?? "");
  const [target, setTarget] = useState(sp.get("cible") ?? "50:00");
  const [copied, setCopied] = useState(false);

  const distanceM = useMemo(() => {
    if (distKey === "custom") {
      const km = Number(customKm.replace(",", "."));
      return Number.isFinite(km) && km > 0 ? km * 1000 : null;
    }
    return standardDistances.find((d) => d.key === distKey)?.meters ?? null;
  }, [distKey, customKm]);

  const computed = useMemo(() => {
    try {
      let secPerKm: number;
      if (mode === "pace") {
        const p = parseDuration(pace);
        if (!p || p <= 0) return { error: "Allure invalide : utilisez le format mm:ss (ex. 5:30)." };
        secPerKm = p;
      } else if (mode === "speed") {
        const s = Number(speed.replace(",", "."));
        if (!Number.isFinite(s) || s <= 0) return { error: "Vitesse invalide." };
        secPerKm = paceSecPerKmFromSpeedKmh(s);
      } else {
        const t = parseDuration(target);
        if (!t || t <= 0) return { error: "Temps cible invalide : format h:mm:ss ou mm:ss." };
        if (!distanceM) return { error: "Distance invalide." };
        secPerKm = paceForTarget(distanceM, t);
      }
      const kmh = speedKmhFromPaceSecPerKm(secPerKm);
      const perMile = paceSecPerMileFromSecPerKm(secPerKm);
      const total = distanceM ? timeForDistance(distanceM, secPerKm) : null;
      const splits = distanceM && distanceM <= 200_000 ? splitsForDistance(distanceM, secPerKm) : [];
      return { secPerKm, kmh, perMile, total, splits };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Erreur de calcul." };
    }
  }, [mode, pace, speed, target, distanceM]);

  useEffect(() => {
    const p = new URLSearchParams();
    p.set("mode", mode);
    if (mode === "pace") p.set("allure", pace);
    if (mode === "speed") p.set("vitesse", speed);
    if (mode === "target") p.set("cible", target);
    p.set("d", distKey);
    if (distKey === "custom" && customKm) p.set("km", customKm);
    router.replace(`?${p.toString()}`, { scroll: false });
  }, [mode, pace, speed, target, distKey, customKm, router]);

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }
  function exportCsv() {
    if (!("splits" in computed) || !computed.splits) return;
    const rows = [["km", "distance_m", "temps_segment", "temps_cumule"], ...computed.splits.map((s) => [s.km, Math.round(s.distanceM), formatDuration(s.splitSec), formatDuration(s.cumulativeSec)])];
    const blob = new Blob([rows.map((r) => r.join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "passages-garmin-ma.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-8">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-2 text-sm font-semibold">Je connais…</legend>
        {([["pace", "mon allure"], ["speed", "ma vitesse"], ["target", "mon temps cible"]] as [Mode, string][]).map(([m, l]) => (
          <label key={m} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium ${mode === m ? "border-accent bg-accent text-white" : "border-border hover:border-fg"}`}>
            <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />{l}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        {mode === "pace" && <Field label="Allure (min/km)" htmlFor="pace" hint="Format mm:ss"><Input id="pace" value={pace} onChange={(e) => setPace(e.target.value)} inputMode="numeric" /></Field>}
        {mode === "speed" && <Field label="Vitesse (km/h)" htmlFor="speed"><Input id="speed" value={speed} onChange={(e) => setSpeed(e.target.value)} inputMode="decimal" /></Field>}
        {mode === "target" && <Field label="Temps cible" htmlFor="target" hint="Format h:mm:ss ou mm:ss"><Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} inputMode="numeric" /></Field>}
        <Field label="Distance" htmlFor="dist">
          <Select id="dist" value={distKey} onChange={(e) => setDistKey(e.target.value)}>
            {standardDistances.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            <option value="custom">Distance libre (km)</option>
          </Select>
        </Field>
        {distKey === "custom" && <Field label="Distance libre (km)" htmlFor="customKm"><Input id="customKm" value={customKm} onChange={(e) => setCustomKm(e.target.value)} inputMode="decimal" placeholder="Ex. 15,5" /></Field>}
      </div>

      {"error" in computed ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{computed.error}</p>
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
            {[
              ["Allure", formatPace(computed.secPerKm)],
              ["Vitesse", `${computed.kmh.toFixed(2).replace(".", ",")} km/h`],
              ["Allure (mile)", formatPace(computed.perMile, "mile")],
              ["Temps total", computed.total !== null ? formatDuration(computed.total) : "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-subtle">{k}</dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          {computed.splits.length > 0 && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Tableau de passages</h2>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={exportCsv}>Exporter (CSV)</Button>
                  <Button type="button" variant="secondary" size="sm" onClick={copyLink}><Link2 className="size-4" aria-hidden />{copied ? "Lien copié" : "Lien partageable"}</Button>
                </div>
              </div>
              <div className="mt-4 max-h-96 overflow-auto rounded-2xl border border-border">
                <table className="w-full text-sm tabular-nums">
                  <thead className="sticky top-0 bg-bg-muted text-left text-xs uppercase tracking-[0.12em] text-fg-subtle">
                    <tr><th className="px-4 py-2">Km</th><th className="px-4 py-2">Segment</th><th className="px-4 py-2">Cumulé</th></tr>
                  </thead>
                  <tbody>
                    {computed.splits.map((s) => (
                      <tr key={s.km} className="border-t border-border"><td className="px-4 py-1.5">{s.distanceM % 1000 === 0 ? s.km : (s.distanceM / 1000).toFixed(3).replace(".", ",")}</td><td className="px-4 py-1.5">{formatDuration(s.splitSec)}</td><td className="px-4 py-1.5 font-medium">{formatDuration(s.cumulativeSec)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
