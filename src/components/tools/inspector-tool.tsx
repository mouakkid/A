"use client";
import { useState } from "react";
import { useActivityWorker } from "./use-activity-worker";
import { FileDrop, type LoadedFile } from "./file-drop";
import { SummaryView, AnomalyList, ElevationProfile } from "./summary-view";
import { TrackPreview } from "./track-preview";
import type { WorkerResponse } from "@/lib/tools/worker";
import { Button } from "@/components/ui/button";

export function InspectorTool() {
  const run = useActivityWorker();
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [state, setState] = useState<{ status: "idle" } | { status: "working" } | { status: "error"; error: string } | { status: "done"; res: Extract<WorkerResponse, { op: "analyze" }> }>({ status: "idle" });

  async function onFile(f: LoadedFile) {
    setFile(f);
    setState({ status: "working" });
    const res = await run({ op: "analyze", text: f.text, byteLength: f.size });
    if (!res.ok) return setState({ status: "error", error: res.error });
    if (res.op !== "analyze") return;
    setState({ status: "done", res });
  }

  return (
    <div className="space-y-8">
      <FileDrop onFile={onFile} />
      {state.status === "working" && <p role="status" className="text-sm text-fg-muted">Analyse en cours dans votre navigateur…</p>}
      {state.status === "error" && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <p className="font-semibold">Fichier refusé ou illisible</p>
          <p className="mt-1">{state.error}</p>
          <p className="mt-2 text-xs">Aucune donnée n'a été modifiée ni envoyée. Vérifiez que le fichier est un GPX ou un TCX complet (export depuis Garmin Connect : « Exporter au format GPX/TCX »).</p>
        </div>
      )}
      {state.status === "done" && file && (
        <div className="space-y-8 animate-fade" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{file.name} <span className="text-sm font-normal text-fg-subtle">({(file.size / 1024).toFixed(0)} Ko)</span></h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setFile(null); setState({ status: "idle" }); }}>Analyser un autre fichier</Button>
          </div>
          <SummaryView s={state.res.summary} />
          <section>
            <h3 className="mb-3 text-lg font-bold">Anomalies plausibles</h3>
            <AnomalyList s={state.res.summary} />
          </section>
          <section>
            <h3 className="mb-3 text-lg font-bold">Tracé</h3>
            <TrackPreview coords={state.res.coords} />
          </section>
          {state.res.elevation.length > 1 && (
            <section>
              <h3 className="mb-3 text-lg font-bold">Altitude</h3>
              <ElevationProfile data={state.res.elevation} />
            </section>
          )}
          <p className="text-xs text-fg-subtle">{state.res.summary.timezoneNote} Le fichier n'a pas été modifié.</p>
        </div>
      )}
    </div>
  );
}
