"use client";
import { useState } from "react";
import { useActivityWorker } from "./use-activity-worker";
import { FileDrop, downloadText, type LoadedFile } from "./file-drop";
import { SummaryView } from "./summary-view";
import type { WorkerResponse } from "@/lib/tools/worker";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/form";

const kindLabels: Record<string, string> = { activity: "activité", track: "trace sans horodatage", route: "itinéraire", course: "parcours", "waypoints-only": "points d'intérêt" };

export function ConverterTool() {
  const run = useActivityWorker();
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [sport, setSport] = useState("Running");
  const [state, setState] = useState<{ status: "idle" } | { status: "working" } | { status: "error"; error: string } | { status: "done"; res: Extract<WorkerResponse, { op: "convert" }> }>({ status: "idle" });

  async function convert(f: LoadedFile, sp = sport) {
    setState({ status: "working" });
    const to = /<\s*TrainingCenterDatabase\b/i.test(f.text.slice(0, 4096)) ? "gpx" : "tcx";
    const res = await run({ op: "convert", text: f.text, byteLength: f.size, to, sport: sp });
    if (!res.ok) return setState({ status: "error", error: res.error });
    if (res.op !== "convert") return;
    setState({ status: "done", res });
  }

  const outName = file ? file.name.replace(/\.(gpx|tcx)$/i, "") + (state.status === "done" ? (state.res.from === "gpx" ? ".tcx" : ".gpx") : "") : "";

  return (
    <div className="space-y-8">
      <FileDrop onFile={(f) => { setFile(f); convert(f); }} label="Déposez un GPX (→ TCX) ou un TCX (→ GPX)" />
      {file && state.status !== "idle" && (
        <Field label="Sport (pour une activité TCX)" htmlFor="sport" hint="Le TCX exige un sport ; « Other » si vous hésitez.">
          <Select id="sport" value={sport} onChange={(e) => { setSport(e.target.value); convert(file, e.target.value); }} className="max-w-xs">
            {["Running", "Biking", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      )}
      {state.status === "working" && <p role="status" className="text-sm text-fg-muted">Conversion en cours…</p>}
      {state.status === "error" && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{state.error}</p>}
      {state.status === "done" && file && (
        <div className="space-y-8 animate-fade" aria-live="polite">
          <div className="rounded-2xl bg-graphite-900 p-6 text-white bg-topo">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Résultat</p>
            <h2 className="mt-1 text-xl font-bold">{state.res.from.toUpperCase()} → {state.res.from === "gpx" ? "TCX" : "GPX"} · {kindLabels[state.res.kind] ?? state.res.kind}</h2>
            <p className="mt-2 text-sm text-white/70">La conversion n'est pas sans perte : lisez le rapport ci-dessous avant d'utiliser le fichier.</p>
            <Button type="button" variant="inverse" className="mt-4" onClick={() => downloadText(outName, state.res.xml)}>Télécharger {outName}</Button>
          </div>
          <section aria-labelledby="report">
            <h3 id="report" className="text-lg font-bold">Rapport de conversion</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <ReportCol title="Conservés" items={state.res.report.kept} tone="ok" />
              <ReportCol title="Transformés" items={state.res.report.transformed} tone="warn" />
              <ReportCol title="Perdus" items={state.res.report.lost} tone="bad" />
            </div>
            {state.res.report.lost.length > 0 && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">Cette conversion perd des informations. Conservez votre fichier original.</p>}
          </section>
          <div className="grid gap-6 md:grid-cols-2">
            <section><h3 className="mb-3 text-lg font-bold">Avant</h3><SummaryView s={state.res.summaryBefore} compact /></section>
            <section><h3 className="mb-3 text-lg font-bold">Après (relecture du fichier produit)</h3><SummaryView s={state.res.summaryAfter} compact /></section>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportCol({ title, items, tone }: { title: string; items: string[]; tone: "ok" | "warn" | "bad" }) {
  const cls = { ok: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200", warn: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200", bad: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200" }[tone];
  return (
    <div className={`rounded-xl border p-4 text-sm ${cls}`}>
      <p className="font-semibold">{title} ({items.length})</p>
      {items.length ? <ul className="mt-2 list-disc space-y-1 pl-4">{items.map((i) => <li key={i}>{i}</li>)}</ul> : <p className="mt-2 opacity-70">Aucun.</p>}
    </div>
  );
}
