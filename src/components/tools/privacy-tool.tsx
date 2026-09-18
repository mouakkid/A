"use client";
import { useState } from "react";
import { useActivityWorker } from "./use-activity-worker";
import { FileDrop, downloadText, type LoadedFile } from "./file-drop";
import { TrackPreview } from "./track-preview";
import type { WorkerResponse } from "@/lib/tools/worker";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export function PrivacyTool() {
  const run = useActivityWorker();
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [startR, setStartR] = useState("300");
  const [endR, setEndR] = useState("300");
  const [dropWp, setDropWp] = useState(true);
  const [stripNames, setStripNames] = useState(false);
  const [state, setState] = useState<{ status: "idle" } | { status: "working" } | { status: "error"; error: string } | { status: "done"; res: Extract<WorkerResponse, { op: "privacy" }> }>({ status: "idle" });

  async function apply(f = file) {
    if (!f) return;
    const s = Number(startR), e = Number(endR);
    if (!Number.isFinite(s) || !Number.isFinite(e) || s < 0 || e < 0 || s > 20000 || e > 20000) return setState({ status: "error", error: "Rayons invalides (0 à 20 000 m)." });
    setState({ status: "working" });
    const res = await run({ op: "privacy", text: f.text, byteLength: f.size, startRadiusM: s, endRadiusM: e, dropWaypoints: dropWp, stripNames });
    if (!res.ok) return setState({ status: "error", error: res.error });
    if (res.op !== "privacy") return;
    setState({ status: "done", res });
  }

  return (
    <div className="space-y-8">
      <FileDrop onFile={(f) => { setFile(f); setState({ status: "idle" }); apply(f); }} />
      {file && (
        <form onSubmit={(e) => { e.preventDefault(); apply(); }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Rayon au départ (m)" htmlFor="startR"><Input id="startR" value={startR} onChange={(e) => setStartR(e.target.value)} inputMode="numeric" /></Field>
          <Field label="Rayon à l'arrivée (m)" htmlFor="endR"><Input id="endR" value={endR} onChange={(e) => setEndR(e.target.value)} inputMode="numeric" /></Field>
          <div className="flex flex-col gap-2 pt-6 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={dropWp} onChange={(e) => setDropWp(e.target.checked)} className="size-4" />Retirer les waypoints</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripNames} onChange={(e) => setStripNames(e.target.checked)} className="size-4" />Retirer les noms (activité, trace)</label>
          </div>
          <div className="pt-6"><Button type="submit">Appliquer</Button></div>
        </form>
      )}
      {state.status === "working" && <p role="status" className="text-sm text-fg-muted">Traitement…</p>}
      {state.status === "error" && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{state.error}</p>}
      {state.status === "done" && file && (
        <div className="space-y-6 animate-fade" aria-live="polite">
          <dl className="grid gap-3 sm:grid-cols-4">
            {[["Retirés au départ", state.res.removedStart], ["Retirés à l'arrivée", state.res.removedEnd], ["Waypoints retirés", state.res.removedWaypoints], ["Points conservés", state.res.kept]].map(([k, v]) => (
              <div key={String(k)} className="rounded-xl border border-border p-3"><dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-subtle">{k}</dt><dd className="mt-0.5 font-display text-xl font-bold">{v}</dd></div>
            ))}
          </dl>
          <section>
            <h3 className="mb-2 text-lg font-bold">Aperçu avant / après</h3>
            <p className="mb-3 text-xs text-fg-subtle">En rouge : les portions retirées (trace d'origine). En bleu : la copie exportée.</p>
            <TrackPreview coords={state.res.after} secondary={state.res.before} />
          </section>
          <ul className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <li className="font-semibold">Limites de l'anonymisation</li>
            {state.res.notes.map((n) => <li key={n}>· {n}</li>)}
            <li>· Un parcours masqué reste potentiellement identifiable : n'utilisez pas cet outil comme unique protection.</li>
          </ul>
          <Button type="button" onClick={() => downloadText(file.name.replace(/\.(gpx|tcx)$/i, "") + `-prive.${state.res.format}`, state.res.xml)} disabled={state.res.kept === 0}>Télécharger la copie</Button>
        </div>
      )}
    </div>
  );
}
